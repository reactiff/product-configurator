import React, { useState, useEffect } from 'react'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Mpg from '../mpg/Mpg'
// import {Inline} from '../../shared/Util'

// import Config from '../../shared/Config'
import api from '../../shared/Api'

const getData = (queries) => {

    return new Promise(async resolve => {

        if(!queries){
            resolve({})
            return
        }

        const keys = Object.keys(queries)

        const results = await Promise.all(keys.map(key => api.get(queries[key].url)))
                
        const data = {}

        for(let index in keys){
            data[keys[index]] = results[index].data
        }

        resolve(data)
    
    })
}

const transformData = (data, transform) => {

    return new Promise(async resolve => {

        if(!transform){
            resolve(data)
            return
        }
                
        const transformed = transform(data)
        

        resolve(transformed)
    
    })
}


const DemoContainer = (props) => {
  
    const [componentData, setComponentData] = useState(null)
    
    useEffect(() => { 
        getData(props.data)
            .then(dataresult => transformData(dataresult, props.transform))
            .then(setComponentData)
    }, [props]);
    
    if(!componentData){
        return null
    }
  
    return props.render(componentData)
}

export default DemoContainer
