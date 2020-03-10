import React from 'react'

import Mpg from './Mpg'

import './css/namevaluepair.css'

const $class = "mpg-name-value-pair"
const $description = 'An inline name: value pair, used for property listings'
const $params = {
    name: { type: 'string' },
    value: { type: 'string' },
    propertyWidth: { type: 'any' }
}

export default (props) => {

    //If no props, return metadata
    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({props: { name: 'color', value: 'red' }})
        }

    }   

    const component = Mpg.PropsParser.parse($class, props, $params)

    return (
        <Mpg.Flex 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')}>

            <Mpg.FlexCol style={{width: props.propertyWidth || 80}}>{props.name}:</Mpg.FlexCol>
            <Mpg.FlexCol grow={1}>{props.value}</Mpg.FlexCol>
        </Mpg.Flex>
    )
}
