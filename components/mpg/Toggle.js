import React, { useState } from 'react'

import Mpg from './Mpg'
import uuid from 'uuid/v4'
import './css/toggle.css'

const $class = "mpg-toggle custom-control custom-switch"
const $description = 'Toggle switch'
const $params = {
    caption: { type: 'string' },
    value: { type: 'boolean' },
    onChange: {type: 'function'},
    small: { type:'boolean' }
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

    const [changedState, setChangedState] = useState(null)

    let value = changedState
    if(value === null){
        value = component.value
    }

    const handleChange = async (value) => {

        setChangedState(value)

        if(component.onChange){
            const success = await component.onChange(value)
            if(!success){
                setChangedState(!value)
            }
        } 
    }

    const controlId = uuid()

    component.style.height = '40px'

    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            >
            
            <input
                type='checkbox'
                className='custom-control-input'
                id={controlId}
                checked={value}
                onChange={(e) => handleChange(e.target.checked)}
                readOnly
            />
            <label className='custom-control-label' htmlFor={controlId}>
                {component.caption}
            </label>

        </div>
    )
}
    
