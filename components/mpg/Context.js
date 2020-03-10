import React from 'react'
import {useIdentity} from '../../hooks/Hooks'

import Mpg from './Mpg'

const $class = "mpg-context"
const $description = 'Renders children if context condition is met'
const $params = { 
 
    condition: { type: 'function', description: '(Optional) Callback that returns true or false', example: '() => true' }, 
    roles: {type: 'string', description: '(Optional) Space separated user roles for which the context will evaluate as true', example: 'admin owner' }, 
    role: {type: 'string', description: '(Optional) Space separated user roles for which the context will evaluate as true', example: 'admin owner' }, 

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
    
    const component = Mpg.PropsParser.parse($class, props, $params)

    if(typeof props.condition !== 'undefined'){
        if(!props.condition()){
            return null
        }
    }

    const identity = useIdentity()

    const roleString = props.role || props.roles
    
    if(typeof roleString !== 'undefined'){

        if(!identity || !identity.role){
            return null
        }

        let contextRoles

        if(Array.isArray(roleString)){
            contextRoles = roleString
        }
        else{
            contextRoles = roleString.trim().toLowerCase().split(' ')
        }

        const result = contextRoles.some(r => identity.roles[r]) 

        if(!result){
            return null
        }
    }


    return props.children
}
    
