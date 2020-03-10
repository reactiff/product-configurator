import React from 'react'

import * as ReactBootstrap from 'react-bootstrap'

import Mpg from './Mpg'

const $class = "mpg-tag"
const $description = 'A generic tag, which can be rendered as any valid HTML or react element'
const $params = {
    as: { type: 'string', description: 'Name of a valid HTML or React tag', example: 'ul' }
} 



export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({
                props: {
                    as: 'ul',
                    children: [
                        <li>A</li>,
                        <li>B</li>,
                        <li>C</li>
                    ]
                }
            })
        }
    }   
    
    // if(props.as && props.onClick){
    //     debugger
    // }

    const component = Mpg.PropsParser.parse($class, props, $params, true)
    
    const tagName = component.as 

    if(component.style && Object.keys(component.style).length) {
        component.other.style = component.style
    }

    if(component.classes && component.classes.length) {
        component.other.className = $class + ' ' + component.classes.join(' ')
    }

    
    const bsTag = ReactBootstrap[tagName] 

    return React.createElement(bsTag || tagName, component.other)
    
}
