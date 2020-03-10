import React from 'react'
import {useEffect, useState, useCallback} from 'react'

import './css/todolist.css'

import Mpg from './Mpg'
import Button from 'react-bootstrap/Button'

import ToDoListManager from './modules/ToDoListManager'

const $class = "mpg-to-do-list"
const $description = 'Development aid.  Best used when loaded as a portal inside the Aside panel'
const $params = {
    path: { type: 'string', required: true },
    title: {type: 'string'},
    text: {type: 'string'},
    noBrowsing: {type: 'boolean'},
}

export default (props) => {

    //If no props, return metadata
    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class
        }

    }   

    const component = Mpg.PropsParser.parse($class, props, $params)
    const toDoList = new ToDoListManager(component.path);

    const [currentPath, setCurrentPath] = useState(component.path)

    const [queryExpressions, setQueryExpressions] = useState([])
    
    const [changedItems, setChangedItems] = useState(0)
    const [newItem, setNewItem] = useState({})
    const [editedItem, setEditedItem] = useState({})
    
    //functions
    
    const onEnterKey = (e, callback) => { if (e.which === 13) { callback(e) } }

    const handleParseNew = () => {
        toDoList.parseNew(newItem.path, newItem.text, newItem.tags)
        setChangedItems(changedItems+1)
    }

    const handleSearch = (input) => {
        try{

            const query = input.value

            if(query.trim().length===0){
                setQueryExpressions([])
                return
            }

            const parts = query.toLowerCase().split(' ').filter(t => t.trim().length)

            const tokens = []

            //each token is an AND
            for(let str of parts){

                let exp = str

                let negate = false
                let matchTag = false

                if(exp[0] === '!') { 
                    negate = true
                    exp = exp.substring(1)
                }

                if(exp[0] === '#') { 
                    matchTag = true
                    exp = exp.substring(1)
                }

                // if(exp[0]!=='('){
                //     exp = '(' + exp + ')'
                // }

                tokens.push({type: 'and', negate: negate, tags: matchTag, pattern: new RegExp(exp, 'gimu')})
            }

            setQueryExpressions(tokens)

        }
        catch(ex){
            setQueryExpressions([])
        }
    }

    const handleSetCurrentPath = (path) => {
        setCurrentPath(path)
    }

    //get items
    let filter = null
    if(queryExpressions.length){

        filter = (item) => {

            const results = Array.from(queryExpressions).fill(false)
            for(let i = 0; i<results.length; i++) {
                let exp = queryExpressions[i]
                if(exp.tags){
                    //match tags only
                    const result = Object.keys(item.tags).some(tag => tag.match(exp.pattern)!==null)
                    results[i] = exp.negate ? !result : result
                }
                else{
                    const tagMatch = Object.keys(item.tags).some(tag => tag.match(exp.pattern)!==null)
                    const textMatch = item.text.match(exp.pattern)!==null
                    results[i] = exp.negate ? !(tagMatch || textMatch) : (tagMatch || textMatch)
                }
            }

            const allTrue = results.reduce((a, b) => a && b, true)
                        
            return item.path.indexOf(currentPath)===0 && allTrue;

        }
    
    }else{
        filter = (item) => {
            return item.path.indexOf(currentPath)===0
        }
    }

    const getPriority = (item) => item.priority - (item.complete * 1000) //helper
    const items = toDoList.getItems({ 
        filter: filter,
        sort: (a,b) => getPriority(b) - getPriority(a) 
    })
    
    //Now, get a list of immediate children of the currentPath
    const subpaths = []
    for(let item of items){
        const subcomponents = item.path.substring(currentPath.length).split('/').filter(x=>x.trim().length>0)
        if(subcomponents.length){
            if(!subpaths.includes(subcomponents[0])){
                subpaths.push(subcomponents[0])
            }
        }
    }

    const pathComponents = ('All/' + currentPath).split('/').filter(x => x.trim().length>0)
    
    const pathTitle = pathComponents[pathComponents.length-1].camelToSentenceCase()

    return (
        <>
        
            <Mpg.Flex row noMargin>

                <Mpg.FontAwesomeIcon icon={['far', 'sticky-note']} size="1x"></Mpg.FontAwesomeIcon>

                <Mpg.Div grow={1} paddingLeft={10}>
                    <h3>{'Notes for ' + pathTitle}</h3>
                </Mpg.Div>    
                
                <Mpg.Modal
                    button={<Button variant="link" size="sm">+ Add</Button>}
                    title={"New note"}
                    body={<Mpg.Form type={{ path: { type: 'string'}, tags: { type: 'string'}, text: { type: 'textarea'}}} model={newItem} noLabels/>}
                    onOpen={() => setNewItem({path: currentPath})}
                    onOk={() => handleParseNew()}
                />

            </Mpg.Flex>

            <Mpg.Flex noMargin className="path">
                <Mpg.div grow={1}>
                    {pathComponents.map((x, i)=>{
                        return (
                            <span key={i}>
                                {i>0 && '/'}

                                {
                                    component.noBrowsing ?
                                    x :
                                    (<Button variant="link" className="no-padding" onClick={() => handleSetCurrentPath('/' + pathComponents.slice(1, i+1).join('/'))}>{x}</Button>)
                                }
                                
                            </span>
                        )})
                    }
                </Mpg.div>

                {subpaths.map((x, i)=><Button key={i} className="subpath" variant="outline-primary" size="sm" onClick={() => handleSetCurrentPath('/' + pathComponents.slice(1, pathComponents.length).join('/') + x)}>{x}</Button>)}
                
            </Mpg.Flex>
            
            <input className="search-input" type="text" placeholder="search..." onKeyUp={(e) => handleSearch(e.target)}></input>

            <Mpg.div alignRight fontSize="75%">
                Showing {items.length} items
            </Mpg.div>

            <Mpg.List 
                {...component.other}
                style={component.style}
                className={$class + ' no-padding ' + component.classes.join(' ')} 
                
            >

                {items.map((item, index)=>{

                    const classes = ['to-do']

                    if(item.complete){
                        classes.push('complete')
                    }

                    if(item.priority>0){
                        classes.push('priority-high')
                        if(index===0){
                            classes.push('priority-top')
                        }
                    }
                    else if(item.priority<0 && item.complete===0){
                        classes.push('priority-low')
                    }

                    const updateItem = (item, changes) => {
                        Object.assign(item, changes)
                        toDoList.replaceItem(item.id, item);
                        setChangedItems(changedItems+1);
                    }
                    
                    const increasePriority = (item) => {
                        const value = item.priority || 0;
                        item.priority = value + 1;
                        toDoList.replaceItem(item.id, item);
                        setChangedItems(changedItems+1);
                    }
                    const decreasePriority = (item) => {
                        const value = item.priority || 0;
                        item.priority = value - 1;
                        toDoList.replaceItem(item.id, item);
                        setChangedItems(changedItems+1);
                    }
                    const toggleComplete = (item) => {
                        const value = item.complete || false;
                        item.complete = !value;
                        toDoList.replaceItem(item.id, item);
                        setChangedItems(changedItems+1);
                    }
                    const deleteItem = (item) => {
                        if(window.confirm('Are you sure?')){
                            toDoList.deleteItem(item.id);
                            setChangedItems(changedItems+1);
                        }
                        
                    }
                    const addTags = (item, input) => {
                        const arr = input.value.toLowerCase().split(' ').map(item=>item.trim()).filter(item=>item.length>0)

                        if(!item.tags){
                            item.tags = {}
                        }

                        for(let tag of arr){
                            if(tag[0]==='-'){
                                delete item.tags[tag.substring(1)]
                            }
                            else{
                                item.tags[tag] = true
                            }
                        }

                        toDoList.replaceItem(item.id, item);
                        input.value = ''
                        input.blur()
                        setChangedItems(changedItems+1);
                    }

                    

                    return (
                        <Mpg.Flex key={index} className={classes.join(' ')} flow="row nowrap" noMargin noPadding >

                            {/* <Mpg.div className="number">{index + 1}.</Mpg.div> */}

                            <Mpg.div className="icon">
                                <Mpg.FontAwesomeIcon className="high" icon={['far', 'star']} size="1x" />
                                <Mpg.FontAwesomeIcon className="top" icon={['fas', 'star']} size="1x" />
                                <Mpg.FontAwesomeIcon className="check" icon={['fas', 'check']} size="1x" />
                                <Mpg.FontAwesomeIcon className="low" icon={['fas', 'long-arrow-alt-down']} size="xs" />
                            </Mpg.div>

                            <Mpg.Flex column className="text" grow={1} noMargin>
                                
                                {
                                    item.text.split('\n').map((token, i) => {
                                        let value = token.trim()
                                        if(value.length===0){
                                            return <br key={i}/>
                                        }
                                        else{
                                            if(value[0] === '#'){
                                                value = <h5 key={i}>{value.substring(1)}</h5>
                                            }
                                            return (
                                                <Mpg.div key={i}>
                                                    {value}
                                                </Mpg.div>
                                            )
                                        }
                                        
                                    })
                                }

                                <div className="tags">
                                    {item.tags && Object.keys(item.tags).map((tag, index)=>(<span key={index} className="tag">{tag + ' '}</span>) )}
                                </div>
                                
                                <input className="new-tag" type="text" placeholder="tags" onKeyPress={(e) => onEnterKey(e, (e)=>addTags(item, e.target))}></input>
                            </Mpg.Flex>

                            <Mpg.Flex column noMargin noPadding>
                                <Mpg.Flex className="buttons" row noMargin noPadding>
                                    <Mpg.Modal
                                        button={<Button className="up" variant="light"><Mpg.FontAwesomeIcon className="edit" icon="edit" size="xs" ></Mpg.FontAwesomeIcon></Button>}
                                        title={"Edit note"}
                                        body={<Mpg.Form type={{ path: { type: 'string'}, text: { type: 'textarea'}}} model={editedItem} noLabels/>}
                                        onOpen={() => setEditedItem({ path: item.path, text: item.text})}
                                        onOk={() => updateItem(item, editedItem)}
                                    />

                                    <Button className="up" variant="light" onClick={()=>increasePriority(item)}>
                                        <Mpg.FontAwesomeIcon className="up" icon="sort-up" size="1x" ></Mpg.FontAwesomeIcon>
                                    </Button>
                                
                                    <Button className="dn" variant="light" onClick={()=>decreasePriority(item)}>
                                        <Mpg.FontAwesomeIcon className="dn" icon="sort-down" size="1x"></Mpg.FontAwesomeIcon>
                                    </Button>
                                
                                    <Button variant="light" onClick={() => toggleComplete(item)}>
                                        <Mpg.FontAwesomeIcon className="check" icon="check" size="xs"></Mpg.FontAwesomeIcon>
                                    </Button>

                                    <Button variant="light" onClick={() => deleteItem(item)}>
                                        <Mpg.FontAwesomeIcon className="delete" icon="times" size="xs"></Mpg.FontAwesomeIcon>
                                    </Button>

                                </Mpg.Flex>
                                {item.path.length>1 && <Mpg.div className="item-path">{item.path}</Mpg.div>}
                            </Mpg.Flex>

                        </Mpg.Flex>
                    )

                })}
                
            </Mpg.List>
        </>
    )
}
    