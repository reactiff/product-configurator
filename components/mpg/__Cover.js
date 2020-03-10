import React from 'react'
//import { useState, useEffect } from 'react'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

//import { useBootstrapGridSize } from '../../hooks/Hooks'

//import { Inline } from '../../Util'
//import { DateUtil } from '../../Util'
//import { TimeUtil } from '../../Util'
//import { ArrayUtil } from '../../Util'

import Config from '../../shared/Config'
//import api from '../../Api'
//import Mpg from '../Mpg'

import './css/cover.css'

export default (props) => {

    const {entity, ...other} = props
    
    const url = Config.url.cdn + 
                '/entity/' + 
                entity.type + '/' + 
                entity.item.partitionKey + '/' + 
                entity.item.id + '/' +
                '1200x630';

    return (
        <div 
            {...other}
            className="mpg-cover" 
            style={{backgroundImage: 'url("' + url + '")'}}
        >
            {props.children}
        </div>
    )
}
    