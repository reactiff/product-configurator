import React from 'react'

import { useEffect, useState } from 'react'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

//import { useBootstrapGridSize } from '../../Hooks/Hooks'

//import { Inline } from '../../Util'
import { DateUtil } from '../../shared/Util'
//import { TimeUtil } from '../../Util'
//import { ArrayUtil } from '../../Util'
import {StringUtil} from '../../shared/Util'
import {fnOrValue} from '../../shared/Util'
//import Config from '../../Config'
//import api from '../../shared/Api'

//import Mpg from '../Mpg'

import './css/form.css'

// import { withRouter } from 'react-router-dom'

import Mpg from './Mpg'

const $class = "mpg-form"
const $description = 'Dinamically creates a form based on an object model'
const $params = {

    title: {type: 'string'},
    type: {type: 'any'},
    excludedOptions: {type: 'array'},
    model: {type: 'any'},
    noLabels: { type: 'boolean' },
    showStatus: { type: 'boolean' },
    fineprint: {type: 'string'},
    onChange: {type: 'function'},
} 

const MpgForm = (props) => {

    const [textAreaCount, setTextAreaCount] = useState(0)

    useEffect(()=>{

        var textareas = document.querySelectorAll("textarea")

        if(textareas.length>0){
            textareas.forEach(ta => textAreaAdjust(ta))
        }
        

    },[textAreaCount])

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({
                props: {
                    type: {
                        name: 'yourtype',
                        plural: 'plural',
                        fields: {
                            name: {type: 'string'},
                            phone: {type: 'phone'},
                            dateOfBirth: {type: 'date'},
                            userId: {type: 'string'},
                            password: {type: 'password'}
                        }
                    },
                    model: {
                        name: '',
                        phone: '',
                        dateOfBirth: '',
                        userId: '',
                        password: ''
                    }
                }
            })
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)
        
    

    if(!component.type || !component.model){
        return null
    }
    
    const fields = !component.type.fields ? component.type : component.type.fields;
    
    let cnt = 0
    const formGroups = Object.keys(fields).map((key, index) => {
        if(fields[key].type==='text' || fields[key].type==='textarea'){
            cnt++
        }
        return getFormGroup(key, fields, component, props.onChange)
    })

    if(cnt !== textAreaCount){
        setTextAreaCount(cnt)
    }

    return (
    
        <>
            {
                component.title &&
                <h1>{component.title}</h1>
            }
            

            <Form 
                {...component.other}
                style={component.style}
                className={$class + ' ' + component.classes.join(' ')} 
                >

                {
                    formGroups
                }

                <Mpg.Render if={props.fineprint}>
                    <Mpg.div marginBottom={30}>
                        <Form.Text className="text-muted">
                            {props.fineprint}
                        </Form.Text>
                    </Mpg.div>                
                </Mpg.Render>
                

                
                

                

            </Form>

        </>
    )
}

export default MpgForm

function textAreaAdjust(textarea) {
    textarea.style.height = "1px";
    textarea.style.height = (2 + textarea.scrollHeight) + "px";
}

function resolveInputType(type) {
    switch(type){
        case 'integer':
        case 'number':
            return 'number'
        default:
            return type
    }
}

const getFormGroup = (key, fields, component, onChange) => {

    const {model, excludedOptions, noLabels, showStatus} = component
    
    const field = fields[key]

    const title = field.prompt || key.camelToSentenceCase()

    let options 
    if(field.options) {
        const excluded = excludedOptions && excludedOptions[key]
        const optionsAsObjects = getOptionsAsObjects(title, field, excluded)
        options = getOptionElements(optionsAsObjects)
        if(typeof model[key] === 'undefined' || model[key] === null) {
            model[key] = optionsAsObjects[0].value
        }
    } 
    
    let asElement = 'input'
    if(field.options){
        asElement = 'select'
    }
    
    let controls = null
    const labelWidth = 150

    const textareas = []

    switch(field.type){
        case 'hidden':
            break;

        case 'boolean':
        case 'checkbox':
            controls = (
                <Form.Group controlId={key} key={key}>
                    <Mpg.Flex row noMargin noPadding>
                        {!noLabels && <Mpg.div width={labelWidth}><Form.Label>{title}</Form.Label></Mpg.div>}
                        <Mpg.div grow>
                            <Form.Check 
                                type="checkbox" 
                                label={title}
                                onChange={(e) => {
                                    model[key] = e.target.value;
                                    if(onChange) {
                                        onChange(key, e.target.value);
                                    }
                                }} 
                                defaultValue={model[key]} 
                                required={fields[key].required} />
                        </Mpg.div>
                    </Mpg.Flex>
                </Form.Group>
            )
            break;
        
        case 'date':
            const inputValue = DateUtil.asInputValue(model[key])
            controls = (
                <Form.Group controlId={key} key={key}>
                    <Mpg.Flex row noMargin noPadding>
                        {!noLabels && <Mpg.div width={labelWidth}><Form.Label>{title}</Form.Label></Mpg.div>}
                        <Mpg.div grow>
                            
                            <Form.Control 
                                    as={asElement}
                                    type="date" 
                                    list={field.options ? key + '_options' : null}
                                    onChange={(e) => {
                                        model[key] = e.target.value;
                                        if(onChange) {
                                            onChange(key, e.target.value);
                                        }
                                    }}
                                    defaultValue={inputValue}
                                    required={fields[key].required} 
                            >
                                {options}
                            </Form.Control>
                        </Mpg.div>
                    </Mpg.Flex>
                </Form.Group>
            )
            break;
        case 'numeric':
            
            controls = (
                <Form.Group controlId={key} key={key}>
                    <Mpg.Flex row noMargin noPadding>
                        {!noLabels && <Mpg.div width={labelWidth}><Form.Label>{title}</Form.Label></Mpg.div>}
                        <Mpg.div grow>
                            
                            <Form.Control 
                                    as={asElement}
                                    type="text" 
                                    inputMode="numeric" 
                                    pattern="[0-9]*" 
                                    onChange={(e) => {
                                        model[key] = e.target.value;
                                        if(onChange) {
                                            onChange(key, e.target.value);
                                        }
                                    }}
                                    defaultValue={model[key]}
                                    required={fields[key].required} 
                                    placeholder={title}
                            >
                                
                            </Form.Control>
                        </Mpg.div>
                    </Mpg.Flex>
                </Form.Group>
            )
            break;
        case 'textarea':
        case 'text':
            controls = (
                <Form.Group controlId={key} key={key}>
                    <Mpg.Flex row noMargin noPadding>
                        {!noLabels && <Mpg.div width={labelWidth}><Form.Label>{title}</Form.Label></Mpg.div>}
                        <Mpg.div grow>
                            <Form.Control 
                                key={key}
                                as={'textarea'}
                                onChange={(e) => {
                                    model[key] = e.target.value;
                                    textAreaAdjust(e.target);
                                    if(onChange) {
                                        onChange(key, e.target.value);
                                    }
                                }}
                                onBlur={(e) => {
                                    model[key] = e.target.value
                                    textAreaAdjust(e.target)
                                }}
                                defaultValue={model[key]}
                                required={fields[key].required} 
                            >
                            </Form.Control>
                        </Mpg.div>
                    </Mpg.Flex>
                </Form.Group>
            )
            break;
            
            // 

        default:
            controls = (
                <Form.Group controlId={key} key={key}>
                    <Mpg.Flex row noMargin noPadding>
                        <Mpg.div grow>

                            {
                                !noLabels && 
                                <Mpg.div width={labelWidth} shaded>
                                    <Form.Label>
                                        <small>{title}</small>
                                    </Form.Label>
                                </Mpg.div>
                            }
                            <Form.Control 
                                as={asElement}
                                type={resolveInputType(field.type)} 
                                placeholder={title} 
                                onChange={(e) => {
                                    model[key] = e.target.value;
                                    if(onChange) {
                                        onChange(key, e.target.value);
                                    }
                                }}
                                defaultValue={model[key]}
                                list={field.options ? key + '_options' : null}
                                required={fields[key].required} 
                            >
                                {options}
                            </Form.Control>

                            {
                                field.footnote && (
                                    <Form.Text className="text-muted">
                                        {field.footnote}
                                    </Form.Text>
                                )

                            }
                        </Mpg.div>
                    </Mpg.Flex>
                </Form.Group>
            )
            break;
    }

    if(!controls){
        return null
    }

    if(showStatus){
        return (
            <Mpg.Flex row key={key} noMargin noPadding>
                <Mpg.div grow>
                    {controls}
                </Mpg.div>
                <Mpg.div noMobile width="50%">
                    {fields[key].status}
                </Mpg.div>
            </Mpg.Flex>
        )
    }
    else{
        return controls
    }
}

const getOptionElements = (optionObjects) => {
    return (
        optionObjects.map((x, index) => {
            return <option key={index} value={x.value}>{x.text}</option>
        })
    )
}


const getOptionsAsObjects = (title, field, excludeList) => {

    const base = []
    if(!field.required){
        base.push({value: field.defaultValue, text: field.defaultValue})
    }

    return (

        base.concat(field.options)
            .filter(x => {
                let excluded = false
                if(field.type==='reference'){
                    excluded = excludeList && excludeList.includes(x.id)
                }
                else{ 
                    if(typeof x === 'string'){
                        excluded = excludeList && excludeList.includes(x.toLowerCase())
                    }else{
                        excluded = excludeList && excludeList.includes(x.value)
                    }
                }
                return !excluded
            })
            .map((x, index) => {
                if(field.type==='reference'){
                    return { value: x.id, text: field.displayFields.map(df => x[df]).join(' ') }
                }
                else{ 
                    if(x.hasOwnProperty('value')) {
                        return x;
                    }
                    else {
                        return {value: x, text: x}
                    }
                }
            })
    )
}