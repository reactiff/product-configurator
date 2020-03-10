import React from 'react'

import './css/flex.css'

import Mpg from './Mpg'


const keyValueStyle = (value, key) => {
    if(value){
        const obj = { style: {} }
        obj.style[key] = value
        return obj
    }
    
}

const $class = "mpg-flex-col"
const $description = 'Flex grid child'
const $params = {
    // alignSelf: { type: 'string', options: ['flex-start','flex-end','center','baseline','stretch'], select: keyValueStyle },
    // grow: { type: 'string', options: ['0','1'], select: keyValueStyle },
    // shrink: { type: 'string', options: ['0','1'], select: keyValueStyle },
} 

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)

    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >
            {component.data}
        </div>
    )

}
    
