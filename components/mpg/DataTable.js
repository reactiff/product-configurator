import React from 'react'
import { useState, useEffect } from 'react'

import api from '../../shared/Api'
import Mpg from './Mpg'

import './css/datatable.css'

const $class = "mpg-data-table"
const $description = 'Data table'
const $params = {
 
  name: {type: 'string'},
  url: {type: 'string', description: 'Api get url'},
  
}


export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class
        }
    }   
        
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    const [items, setItems] = useState([])
    
    useEffect(() => {

        api.get(props.url)
        .then(json => {
            setItems(json.data)
        })
    }, [props.url]);

    let data;

    if(props.name){
        data = {}
        data[props.name] = items
    }
    else{
        data = items
    }
    

    return (

        <Mpg.Inspector data={ data } expanded={false} />
        
    )
}
    
