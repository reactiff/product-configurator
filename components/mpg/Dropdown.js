import React, { useState } from 'react'
import {Dropdown, DropdownButton} from 'react-bootstrap'

import Mpg from './Mpg'

import './css/toggle.css'

const $class = "mpg-dropdown"
const $description = 'Dropdown button with updated state'
const $params = {
    title: {type: 'string'},
    value: { type: 'any', required: true },
    options: { type: 'array', required: true },
    variant: {type: 'string', default: 'outline-dark' },
    drop: {type: 'string', default: 'down' },
    alignRight: {type: 'boolean', default: false, override: true },
    onChange: {type: 'function'},
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
            if(typeof success !== 'undefined' && !success){
                setChangedState(!value)
            }
        } 
    }

    const options = component.options
    if(options && options.length){
        if(options[0]==='' || options[0].value===''){

            if(options[1] !== '-' ){
                options[0] = {value: '', text: options[0].text || 'None'}
                options.splice(1, 0, '-')
            }
            
        }
    }
    

    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            >
            
            <DropdownButton
                variant={component.variant || 'outpine-primary'}
                // alignRight={component.alignRight}
                drop={component.drop}
                title={component.title || value || ''}
                onSelect={(eventKey) => handleChange(eventKey)}
            >
            
                {
                    component.options.map((option, index)=>{

                        const optionText = typeof option.text !== 'undefined' ? option.text : option
                        const optionValue = typeof option.value !== 'undefined' ? option.value : option

                        if(option==='-'){
                            return <Dropdown.Divider key={index}/>
                        }
                        else{
                            
                            //value === optionValue
                            return (
                                <Dropdown.Item key={index} as="button" eventKey={optionValue} style={{padding: '1px 15px 1px 20px'}}>

                                    <Mpg.Flex row tight padded>
                                        {
                                            value === optionValue &&
                                            <Mpg.FontAwesomeIcon icon="check" style={{marginTop: 4}}/>
                                        }
                                        {
                                            value !== optionValue &&
                                            <Mpg.div style={{width: 16}} />
                                        }
                                        <span>{optionText}</span>
                                    </Mpg.Flex>
                                    
                                </Dropdown.Item>
                            )
                        }
                        
                    })
                }  

            </DropdownButton>

        </div>
    )
}
    
