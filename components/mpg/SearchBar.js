import React from 'react'
import {useEffect} from 'react'


import Mpg from './Mpg'

import './css/searchbar.css'

const $class = "mpg-searchbar"
const $description = 'Just a search bar which fires onChange event'
const $params = {
    onChange: {type: 'function'},
    onEnter: {type: 'function'},
    placeholder: {type: 'string'},
    focus: {type: 'boolean', default: false}
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

    const inputRef = React.createRef()

    const handleKeyUp = (e) => {
        if(props.onChange){
            component.onChange(e.target.value, e.target)
        }
    }

    const handleEnterKey = (e) => { 
        if (e.which === 13) { 
            if(component.onEnter){
                component.onEnter(e.target.value, e.target)
            }
            e.target.blur()
        } 
    }
    
    const handleBlur = (e) => { 
        if(component.onEnter){
            component.onEnter(e.target.value, e.target)
        }
    }

    useEffect(()=>{
        if(component.focus && inputRef.current){
            inputRef.current.focus()
        }
    },[inputRef.current])
    
    const {onChange, onEnter, ...other} = component.other
    return (
        <input 
            {...other}
            ref={inputRef}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            placeholder={component.placeholder || "Search..."}
            type="text" 
            onKeyUp={handleKeyUp}
            onKeyPress={handleEnterKey}
            onBlur={handleBlur}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            >
        </input>
    )


    // WITH HAS MAGNIFYING CLASS

    // <InputGroup className="mb-3">
    //     <InputGroup.Prepend>
    //         <InputGroup.Text id="basic-addon1">
    //             <Mpg.FontAwesomeIcon icon="search"></Mpg.FontAwesomeIcon>
    //         </InputGroup.Text>
    //     </InputGroup.Prepend>
    //     <FormControl
    //         placeholder="Username"
    //         aria-label="Username"
    //         aria-describedby="basic-addon1"
    //     />
    // </InputGroup>
}
    
    
