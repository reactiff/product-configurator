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

//import './css/_template.css'


import Mpg from './Mpg'

const $class = "mpg-"
const $description = ''
const $params = [] 
const $examples = []

export default (props) => {

    const component = Mpg.PropsParser.parse($class, props, $params)

    if(component.meta){
        return {
            description: $description,
            params: $params,
            examples: $examples,
            class: $class
        }
    }

    

    const content = props.children
    const contentType = typeof props.children

    const MAXLEVEL = 1

    const traverse = (obj, level = 1) =>{
        
        if(level>MAXLEVEL){
            return
        }

        const result = {}
        for(let key in obj){
            result[key] = {
                _: typeof obj[key] + ' ' + key,
                $: obj[key] && traverse(obj[key], level + 1),
                //string: content[key] && JSON.stringify(Object.keys(content[key]), null, '  ')
            }
        }

        return result
    }

    const tree = traverse(content)

    return (
        <>

            <strong>{contentType}</strong>

            <pre>{JSON.stringify(tree, null, '  ')}</pre>

        </>
    )

}
