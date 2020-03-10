import React from 'react'
import { useState, useEffect } from 'react'

import Mpg from './Mpg'
import api from '../../shared/Api'

const $class = "mpg-no-element-output"
const $description = 'Asynchronously loads specified entity type from cache, then calls value callback with item as argument, to get back the value, and then outputs it.'
const $params = {
    entityType: {type: 'string', required: true},
    value: {type: 'function', required: true},
    default: {type: 'function'},
    revision: {type:'number', description: 'Forces a refresh', default: 0}
}

/**
 * @param {{type: string, value: function}} props 
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

    const [type, setType] = useState(null)

    useEffect(()=>{
      if(!type){
          api.getType(component.type)
            .then(json => {
                setType(json)
            })
      }
    }, [component.type])      

    if(type){
        if(props.value){
            return props.value(type)
        }
        else {
            return type
        }
    }
    
    return null
}
    
