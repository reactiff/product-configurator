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

//import Mpg from '../Mpg'

// import Button from 'react-bootstrap/Button'

import './css/flex.css'

import Mpg from './Mpg'
// import { StringUtil } from '../../shared/Util'

const keyClass = (value, key) => value && ({ class: key })
const keyValueClass = (value, key) => value && ({ class: key + '-' + value.replace(/\s/g, '-') })
const keyValueStyle = (value, key) => {
    if(value){
        const obj = { style: {} }
        obj.style[key] = value
        return obj
    }
}
const customClass = (name) => ({ class: name })
const customStyle = (key, value) => {
    const obj = { style: {} }
    obj.style[key] = value
    return obj
}

const $class = "mpg-flex"
const $description = 'Creates a flex container, making all children same size'
const $params = {

    direction: { type: 'string', options: ['row','row-reverse','column','column-reverse'], select: keyValueClass },
    wrap: { type: 'string', options: ['nowrap','wrap','wrap-reverse'], select: keyValueClass },
    flow: { type: 'string', options: ['row nowrap','column-reverse','column wrap','row-reverse wrap-reverse'], select: keyValueClass },
    order: { type: 'string', options: ['-1','0','1'], select: keyValueClass },

    justifyContent: { type: 'string', options: ['flex-start','flex-end','center','space-between','space-around','space-evenly'], select: keyValueClass  },
    alignItems: { type: 'string', options: ['flex-start','flex-end','center','baseline','stretch'], select: keyValueClass },
    alignContent: { type: 'string', options: ['flex-start','flex-end','center','space-between','space-around','space-evenly','stretch'], select: keyValueClass },

    basis: { type: 'string', options: ['30%','50%','content'], select: keyValueStyle },

    

    //short hand directives

    row: { type: 'boolean', select: (value, key)=>customClass('direction-'+key)  },
    column: { type: 'boolean', select: (value, key)=>customClass('direction-'+key) },

    padded: { type: 'boolean', select: keyClass },


} 

export default React.forwardRef((props, ref) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,

            parametric: {

                items: {

                    count: 1,

                    min: 1,
                    max: 12,

                    getItem: (index) => (
                        <div>{index}</div>
                    )

                }
            }
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    const data = Array.isArray(component.data) ? component.data : [component.data]

    if(ref) {
        component.other.ref = ref
    }
    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >

            {data}
            
        </div>
    )

})
    
