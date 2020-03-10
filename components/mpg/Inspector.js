import React from 'react'
import JsonInspector from 'react-json-inspector'

import './css/json-inspector.css'

import Mpg from './Mpg'


import Entity from '../../shared/Entity'

import Env from '../../shared/Env'

const $class = "mpg-inspector"
const $description = 'On page object inspector.  Displays collapsibale object properties.  Used for development.'
const $params = {
    expanded: { type: 'function', example: '(path, query) => true' },
    expandedPath: { type: 'string', description: 'Expanded path', example: '0.sessionDate' } ,
    disableSearch: { type: 'boolean' },
    title: { type: 'string' },
    data: { type: 'any', example: '{ locals: locals }' }
}

export default (props) => {
    


    // if(!props){
    //     return {
    //         description: $description,
    //         params: $params,
    //         class: $class,
    //         getSampleData: ()=> {

    //             return [
    //                 new Entity('profile', profile1),
    //                 new Entity('profile', profile2)
    //             ]
    //         }
    //     }
    // }   
    
    if(!Env.inspect) {
        return null;
    }
    //return null

    const component = Mpg.PropsParser.parse($class, props, $params)

    component.style.marginBottom = 15

    const _props = {
        data: component.data || {},
        isExpanded: (keypath, query) => {

            if(typeof component.expanded !== 'undefined'){
                if(typeof component.expanded === 'function'){
                    return component.expanded(keypath, query)
                }
                else{
                    return component.expanded
                }
            }
            
            if(typeof component.expandedPath !== 'undefined'){
                const pathExp = new RegExp(keypath.replace(/\./gi, '\.'), 'gi')
                if(typeof keypath === 'string' && pathExp.test(component.expandedPath)){
                    return true
                }
            }
            return false
        },
        filterOptions: {ignoreCase: true}
    }

    if(component.disableSearch){
        _props.search = false
    }

    return (
        <div
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')}     

        >
            {props.title && <h5>{props.title}</h5> }

            <JsonInspector 
                {..._props}
            />

        </div>
        
    )
}
