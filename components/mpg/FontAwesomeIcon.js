import React from 'react'
import Mpg from './Mpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import './css/responsiveheader.css'

const $class = "mpg-fa-icon"
const $description = 'FontAwesome icon'
const $params = {
    icon: { type: 'any' },
    size: { type: 'any' },
}
const $sampleProps = {  }
export default (props) => {

    //If no props, return metadata
    if(!props){
        return { description: $description, params: $params, class: $class, getSampleData: () => ({props: $sampleProps}) }
    }   

    const component = Mpg.PropsParser.parse($class, props, $params)

    return (
        <FontAwesomeIcon 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            icon={component.icon} size={component.size}/>
    )
}
    

