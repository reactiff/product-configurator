import React from 'react'
import { useState, useEffect } from 'react'

//import { useBootstrapGridSize } from '../../Hooks/Hooks'

import { Inline } from '../../shared/Util'
import { DateUtil } from '../../shared/Util'
import { TimeUtil } from '../../shared/Util'
import { ArrayUtil } from '../../shared/Util'

import api from '../../shared/Api'

import Mpg from './Mpg'

import './css/_template.css'

const $class = "mpg-"
const $description = ''
const $params = {
    small: { type: 'string', options: ['small'], select: Mpg.PropsParser.keyClass },
    onClick: {type: 'function'},
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
    
