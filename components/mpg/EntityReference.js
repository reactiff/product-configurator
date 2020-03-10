import React from 'react'
import { useState, useEffect } from 'react'

import Mpg from './Mpg'
import api from '../../shared/Api'

const $class = "mpg-no-element-output"
const $description = 'Asynchronously loads specified entity from cache, then calls value callback with item as argument, to get back the value, and then outputs it.'
const $params = {
    entityType: {type: 'string', required: true},
    id: {type: 'string', required: true},
    value: {type: 'function', required: true},
    default: {type: 'function'},
    revision: {type:'number', description: 'Forces a refresh', default: 0}
    
}

/**
 * @param {{entityType: string, id: string, value: function, default: any, revision: number}} props 
 */
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

    const {entityType, id} = props

    if(!id){
        if(typeof props.default !== 'undefined'){
            if(typeof props.default === 'function'){
                return props.default()
            }
            else{
                return props.default
            }
            
        }
        return null
    }

    const [item, setItem] = useState(null)
    const [itemRevision, setItemRevision] = useState(null)
    const [notFound, setNotFound] = useState(false)

    const revision = component.revision

    const instanceRef = React.useRef({ unloaded: false })

    useEffect(()=>{
      if(!item || item && item.id !== component.id || itemRevision !== revision){
          api.getCachedItem(entityType, id)
            .then(json => {
                if(instanceRef.current.unloaded){
                    console.log('WE GOT IT ' + id + ' unloaded before it resolved');
                    return;
                }
                
                if(!json.data){
                    setNotFound(true)
                }
                setItem(json.data)
                setItemRevision(revision)
            })
      }

      return () => { 
        instanceRef.current.unloaded = true;
      }

    }, [entityType, id, revision])      

    if(item && item.id === component.id && itemRevision === revision){
        if(props.value){
            return props.value(item)
        }
        else {
            return item
        }
    }
    
    return null
}
    
