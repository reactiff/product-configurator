import React from 'react'
import { useState, useEffect } from 'react'

import {Button, Spinner} from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup'

import {useIdentity} from '../../hooks/Hooks'

import Entity from '../../shared/Entity'
import api from '../../shared/Api'
import Mpg from './Mpg'

import './css/crudlist.css'

const $class = "mpg-crud-list"
const $description = 'Generic list with CRUD functions'
const $params = {
    
    entityType: { type: 'any', required: true},
    allow: { type: 'string', required: true, description: 'A string containing C R U D characters, case insensitive', example: "crud" },
    elementForItem: { type: 'function', required: true, example: '(e) => <div>{e.toString()}</div>'},

    params: { type: 'any' } ,
    sort: { type: 'function'},
    views: { type: 'any' },

    cache: { type: 'boolean' },

    url: { type: 'string' },

    title: {type: 'string' },
    pluralTitle: {type: 'string' },
    
    specialization: { type: 'string' },
    parentEntity: { type: 'any' },
    caption: { type: 'string' },
    onChange: { type: 'function' },
    
    filterForItem: {type: 'function'},

    onEntities: {type: 'function', description: 'Called when entities load.  Can be used by parent for inspection'},
    search: { type: 'boolean', default: true },

    noTitle: { type: 'boolean', default: false },
    noCount: { type: 'boolean', default: false },
    showCount: { type: 'boolean', default: false },
    searchExpanded: { type: 'boolean', default: false },

    disableSearchToggle: { type: 'boolean', default: false },

    defaultIcon: { type: 'string' },

    regex: { type: 'boolean', example: false },
    itemStyle: {type: 'any'}
}

export default (props) => {

    //If no props, return metadata
    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: null
        }

    }   

    const component = Mpg.PropsParser.parse($class, props, $params)
    const identity = useIdentity()

    if(props.regex){
        throw new Error('Regex search is not implemented')
    }

    const crud = component.allow.toLowerCase()
    const allow = {
        create: crud.indexOf('c') >=0,
        read: crud.indexOf('r') >=0,
        update: crud.indexOf('u') >=0,
        delete: crud.indexOf('d') >=0,
    }

    const [type, setType] = useState(null)
    const [error, setError] = useState(null)
    const [entities, setEntities] = useState([])
    const [itemsChanged, setItemsChanged] = useState(0)
    const [searchFilter, setSearchFilter] = useState('')
    const [loading, setLoading] = useState(false)
    const [searchExpanded, setSearchExpanded] = useState(component.searchExpanded)
    const [displayedCount, setDisplayedCount] = useState(0)
    const [viewTabKey, setViewTabKey] = useState(null)

    if(type && props.entityType !== type.name ){
        setType(null)
        return
    }
    

    // load type
    useEffect(() => {  
        setError(null)
        setType(null)
        setEntities([])
        setLoading(true)
        api.getType(props.entityType).then(type => {
            setType(type)
            setLoading(false)
        })

    }, [props.entityType])

    let url = component.url
    
    if(type){
        url = component.url || api.createParameterizedUrl(type, component.params, component.parentEntity)
    }
    
    useEffect(() => { 

        if(!url){
            return 
        }

        if(!allow.read){
            return
        }

        setLoading(true)

        const getMethod = component.cache ? api.getCachedUrl : api.get

        getMethod(url).then(results => {

            setLoading(false)
            
            if(props.sort){
                results.data.sort(props.sort)
            }

            const entities = Entity.fromArray(results.data, {toString: component.itemToString})
            setEntities(entities)
            if(props.onEntities){
                props.onEntities(entities)     
            } 
        })
        .catch((reason)=>{
            setError(reason)
            setLoading(false)
        })

    
        
    }, [url, itemsChanged]);

    const handleSearch = (text) => {
        setSearchFilter(text.toLowerCase())
    }

    const filterForItem = (entity, index) => {
        
        if(!searchFilter && !component.filterForItem){
            return true
        }

        if(component.filterForItem){
            if(!component.filterForItem(entity)){
                return false
            }
        }

        let values = Object.keys(entity.item)
            .filter(key => key[0]!=='_')
            .map(key => entity.item[key])
            .filter(value => value && typeof value!=='object')
            .map(value => value.toString().toLowerCase())

        Object.keys(entity.ref).some(refKey => {

            const refItem = entity.ref[refKey]

            values = values.concat(
                Object.keys(refItem)
                .filter(key => key[0]!=='_')
                .map(key => refItem[key])
                .filter(value => value && typeof value!=='object')
                .map(value => value.toString().toLowerCase())
            )

        })

        const filterTokens = searchFilter.split(' ')

        const tokenResults = filterTokens.map(token => {
            return values.some(value => value.indexOf(token)>=0) ? 1 : 0
        })

        //its a match if EVERY token of the query is found somewhere
        const itemMatch = tokenResults.reduce((a,b) => a+b, 0) === tokenResults.length

        return itemMatch
    }

    if(!type){
        return null
    }

    ///
    const elementForItem = (entity, index) => {
        return (
            <ListGroup.Item 
                style={component.itemStyle} 
                key={index} 
                className="relative no-margin no-padding"
            >
                <Mpg.div className="item-toolbar">
                    {
                        allow.update && 
                        <Mpg.CrudEditEntity 
                            entityType={props.entityType}
                            specialization={props.specialization}
                            entity={entity}
                            caption="Edit" 
                            onChange={()=>{ setItemsChanged(itemsChanged+1) }}
                        />
                    }
                    {
                        allow.delete && 
                        <Button variant="link"
                            onClick={() => {
                                api.delete(entity).then(result=>{
                                    if(result.ok){
                                        setItemsChanged(itemsChanged+1)
                                    }
                                })
                            }}
                        >
                            <Mpg.FontAwesomeIcon icon={['fas', 'times']} size="xs"/>
                        </Button>
                    }
                </Mpg.div>
                {props.elementForItem(entity, index)}
            </ListGroup.Item> 
        )
    }


    const filteredItems = entities.filter(filterForItem)

    // if(component.sort){
    //     filteredItems.sort(component.sort)
    // }

    //const title =  props.title || type.display.name || type.name.toProperCase()
    const pluralTitle = (props.pluralTitle || type.display.plural || (props.entityType + 's').toProperCase())

    let content = null

    if(component.views){
        const tabs = {}

        const getViewItems = (key) => {
            return component.views[key].filter ?
                filteredItems.filter(component.views[key].filter) :
                filteredItems
        }
        
        for(let key in component.views){
            tabs[key] = <Mpg.List
                {...component.other}
                style={component.style}
                className={$class + ' ' + component.classes.join(' ')} 
                elementForItem={elementForItem}
                onData={(data)=>setDisplayedCount(data.length)}
                >
                {getViewItems(key)}
            </Mpg.List>
        }
        content = <Mpg.Tabs activeKey={viewTabKey} onChange={(key)=>setViewTabKey(key)}>{tabs}</Mpg.Tabs>
    }
    else{
        content = <Mpg.List
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            elementForItem={elementForItem}
            onData={(data)=>setDisplayedCount(data.length)}
            >
            {filteredItems}
        </Mpg.List>
    }

    const showCount = !component.noCount && !loading && entities.length>0
    const searchEnabled = component.search && !loading && entities.length>0 

    return (
        <>
            {
                (!component.noTitle || allow.create) && 
                <Mpg.Flex className="list-title" noMargin alignItems="flex-end" padded>

                    <Mpg.div>
                        {
                            !component.noTitle && 
                            <h2>{pluralTitle}</h2>
                        }    
                    </Mpg.div>

                    <Mpg.div grow></Mpg.div>

                    
                    {
                        allow.create && 
                        <Mpg.div marginLeft={5}>
                            <Mpg.CrudAddEntity 
                                parentEntity={props.parentEntity}
                                entityType={props.entityType}
                                specialization={props.specialization}
                                caption={'+ New ' + (type.display.name || type.name.toProperCase())}
                                onChange={()=>{ setItemsChanged(itemsChanged+1) }}
                            />  
                        </Mpg.div>
                    }
                    
                    {
                        
                        searchEnabled &&
                        !component.disableSearchToggle &&
                        <Mpg.div>
                            <Button className="smaller" variant="link" 
                                onClick={() => {
                                    setSearchFilter('')
                                    setSearchExpanded(x => !x)
                                }}>
                                {!searchExpanded &&  <span>Filter</span>}
                                {searchExpanded &&  <span>&laquo; hide filter</span>}
                            </Button>

                                
                        </Mpg.div>
                    }       
                    
                </Mpg.Flex>
            }

            <Mpg.Flex row tight padded alignItems="center" marginBottom={5}>
                
                
                {
                    showCount && 
                    <Mpg.div grow textAlign="right" noPadding smaller paddingRight={5} >
                        {
                            !searchFilter &&
                            <span>
                                Showing {displayedCount}
                            </span>
                        }
                        {
                            searchFilter &&
                            <span>
                                Matched {filteredItems.length}
                            </span>
                        }
                    </Mpg.div>
                } 
            </Mpg.Flex>

            {
                searchEnabled && searchExpanded &&
                <Mpg.SearchBar focus onChange={(text, input) => handleSearch(text, input)}/>
            }
            
            {
                !loading && entities.length === 0 &&
                <Mpg.Panel solid borderRadius={5}>
                    <Mpg.Flex tight alignItems="center" padded>
                        {
                            component.defaultIcon &&
                            <Mpg.div>
                                <Mpg.FontAwesomeIcon icon={component.defaultIcon} size="2x"/>
                            </Mpg.div>
                        }
                        <Mpg.div>
                            There are no {component.specialization} {pluralTitle.toLowerCase()} to display.
                        </Mpg.div>
                        
                    </Mpg.Flex>
                </Mpg.Panel>
            }

            {
                !loading && searchFilter && entities.length>0 && filteredItems.length===0 &&
                <Mpg.Panel solid borderRadius={5}>
                    <Mpg.Flex tight >
                        {"'" + searchFilter + "' does not match anything."}
                    </Mpg.Flex>
                </Mpg.Panel>
            }
            
            {
                loading &&
                <Mpg.Panel textAlign="right" noPadding smaller>
                    <Spinner animation="grow" variant="secondary" />
                </Mpg.Panel>
            }

            {
                filteredItems.length>0 &&
                content
            }

            {/* <Mpg.Portal id="crudlist" targetContainer="asidePortal">
                <Mpg.Inspector data={filteredItems} expanded={false} title={type.plural} />
            </Mpg.Portal> */}
        </>
    )
}
    
