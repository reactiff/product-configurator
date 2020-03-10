import React from 'react'
//import { useState, useEffect } from 'react'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useBootstrapGridSize } from '../../hooks/Hooks'

import { Inline } from '../../shared/Util'
//import { DateUtil } from '../../Util'
//import { TimeUtil } from '../../Util'
//import { ArrayUtil } from '../../Util'

//import Config from '../../Config'
//import api from '../../Api'

//import Mpg from '../Mpg'

import './css/multicolumnlist.css'

import Mpg from './Mpg'

const $class = "mpg-multicolummn-list"
const $description = 'Creates a newspaper style, multi column responsive view for long text or lists'
const $params = {
    xs : { type: 'integer', description: 'xs column count. default 1', select: (value) => ({ xsColumnCount: value }) },
    sm : { type: 'integer', description: 'sm column count. default 2', select: (value) => ({ smColumnCount: value }) },
    md : { type: 'integer', description: 'md column count. default 3', select: (value) => ({ mdColumnCount: value }) },
    lg : { type: 'integer', description: 'lg column count. default 4', select: (value) => ({ lgColumnCount: value }) },
    xl : { type: 'integer', description: 'xl column count. default 5', select: (value) => ({ xlColumnCount: value }) },
} 

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => {

                return Mpg.LoremIpsum.generateWords(100)

            }
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)

    
    
    const gridSize = useBootstrapGridSize()

    const columnCount = Inline.switch(gridSize, 
        component.xsColumnCount || 1,
        'sm', component.smColumnCount || 2,
        'md', component.mdColumnCount || 3,
        'lg', component.lgColumnCount || 4,
        'xl', component.xlColumnCount || 5
    )

    const style = {
        columnCount: columnCount
    }

    Object.assign(style, component.style)
    
    return (
        <div 
            {...component.other}
            style={style}
            className={$class + ' ' + component.classes.join(' ')} >

            {component.data}

        </div>
    )
}
