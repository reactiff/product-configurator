import React from 'react'
import Mpg from './Mpg'

import {fnOrValue} from '../../shared/Util'
import Inline from '../../shared/Inline'

//import './css/_template.css'

const $class = "mpg-no-class"
const $description = 'Works like a switch(){ case: } statement.  Renders one of the child Cases by matching the keys'
const $params = {
    key: { type: 'any', example: 'value or predicate' },
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

    //TODO implement this

    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            >
            {/* {component.children} */}
        </div>
    )
}
    
