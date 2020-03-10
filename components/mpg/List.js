import React from 'react'

import ListGroup from 'react-bootstrap/ListGroup'

import Entity from '../../shared/Entity'

import Mpg from './Mpg'
import PropsParser from './modules/PropsParser'

import './css/list.css'

const $class = "mpg-list"
const $description = 'Renders a list of child Elements, Entities or text items passed as props.data or children'
const $params = {
    small: { type: 'string', options: ['small'], select: PropsParser.keyClass },
    onClick: {type: 'function'},
    onData: {type: 'function'},
    onDoubleClick: {type: 'function'},
    elementForItem: {type: 'function', description: '(entity, index) => <element/>'},
    filterForItem: {type: 'function'},
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

    if(!component.data){
        return null
    }

    if(component.onData){
        component.onData(component.data)
    }

    return (
        <ListGroup 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            
            variant="flush">

            {component.data.map((item, index)=>{

                if(props.filterForItem){
                    if(!props.filterForItem(item, index)){
                        return null
                    }
                }

                if(component.elementForItem){
                    return component.elementForItem(item, index)
                }
                else{
                    if(item instanceof Entity) {
                        return <ListGroup.Item key={index} onClick={component.onClick} onDoubleClick={component.onClick}>{item.toString()}</ListGroup.Item>    
                    }
                    else {
                        return <ListGroup.Item key={index} onClick={component.onClick} onDoubleClick={component.onClick}>{item}</ListGroup.Item>    
                    }
                }
                
                
            })}
            
            
        </ListGroup>
    )
}
