import React from 'react'
import Mpg from './Mpg'
//import './css/_template.css'

const $class = "mpg-prop-strip"
const $description = 'Inline key value pair strip'
const $params = {
    // small: { type: 'string', options: ['small'], select: Mpg.PropsParser.keyClass },
    data: {type: 'any', example: '{ avgVal: 5, minVal: 0, maxVal: 10 }\n'},
    justifyContent: {type: 'any'},
    labelForItem: {type: 'function'},
}
const $sampleProps = {data: {avgVal: 5,minVal: 0,maxVal: 10}}
export default (props) => {

    //If no props, return metadata
    if(!props){
        return { description: $description, params: $params, class: $class, getSampleData: () => ({props: $sampleProps}) }
    }   

    const component = Mpg.PropsParser.parse($class, props, $params)

    return (
        <Mpg.Flex 
            row 
            tight 
            padded
            justifyContent={props.justifyContent}
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        > 
            {
                Object.keys(component.data).map(key => {

                    const label = props.labelForItem ? props.labelForItem(key) : key.camelToSentenceCase().toUpperCase();
                    return <Mpg.Flex tight column textAlign="center" key={key} grow>
                        <small>{label}</small>
                        <h5>{component.data[key]}</h5>
                    </Mpg.Flex>
                })
            }
        </Mpg.Flex>
    )
}
    
