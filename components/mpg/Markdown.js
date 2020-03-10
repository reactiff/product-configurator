import React from 'react'
import ReactMarkdown from 'react-markdown'
import Mpg from './Mpg'

const $class = "mpg-markdown"
const $description = 'Markdown container'
const $params = {
    source: { type: 'string' }
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

    const markedDownText = component.source || component.data
    
    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            >
            <ReactMarkdown source={markedDownText}/>
        </div>
    )
}
    

    
