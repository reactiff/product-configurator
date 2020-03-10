import React from 'react'
//import { useState, useEffect } from 'react'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//import { useBootstrapGridSize } from '../../Hooks/Hooks'

//import { Inline } from '../../Util'
//import { DateUtil } from '../../Util'
//import { TimeUtil } from '../../Util'
//import { ArrayUtil } from '../../Util'

//import Config from '../../Config'
//import api from '../../Api'

import Mpg from './Mpg'
import './css/abs.css'


// METADATA
const $class = "mpg-abs"
const $description = 'Wraps content in a div with absolute position'
const $params = [] 
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
            id={component.id}
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >
            {component.children}
        </div>
    )
}


