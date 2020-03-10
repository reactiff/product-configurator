import React from 'react'
import Mpg from './Mpg'
import {useIdentity} from '../../hooks/Hooks'

import Config from '../../shared/Config'
import Env from '../../shared/Env'

const $class = "mpg-render"
const $description = 'Similar to renders children if the condition is met'
const $params = { 
    if: { type: 'function', description: '(Optional) Callback that returns true or false', example: '() => true' } ,
    debug: { type: 'boolean' }
}

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({

                props: {
                    condition: () => true,
                    role: 'student'
                }
                
            })
        }
    }   
    
    
    if(!props.if){
        return null
    }
    
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    const context = {
        config: Config,
        identity: useIdentity(),
        environment: Env,
    }

    const truthy = typeof props.if === 'function' ? props.if(context) : props.if

    if(!truthy){
        return null
    }

    return props.children
}
    
