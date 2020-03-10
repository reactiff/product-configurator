import React from 'react'

import Button from 'react-bootstrap/Button'

import { useState, useEffect } from 'react'
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useBootstrapGridSize, useIdentity } from '../../hooks/Hooks'

//import { Inline } from '../../Util'
//import { DateUtil } from '../../Util'
//import { TimeUtil } from '../../Util'
//import { ArrayUtil } from '../../Util'

//import Config from '../../Config'
import api from '../../shared/Api'
import Mpg from './Mpg'

import Modal from './Modal'
import Form from './Form'

//import './css/_template.css'

const $class = "mpg-edit-entity"
const $description = 'Generic dialog for editing entities'
const $params = {
    button: { type: 'element', example: '<Button variant="secondary"/>' },
    entityType: { type: 'string'},
    specialization: { type: 'string' },
    entity: { type: 'any' }, 
    fields: { type: 'array' }, 
    caption: { type: 'string' },
    title: { type: 'string' },
    excludedOptions: { type: 'any' },
    onChange: { type: 'function' },
    labels: {type: 'boolean'}, 
    noLabels: {type: 'boolean'}, 
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

    const identity = useIdentity()

    const sysadmin = identity.roles.sysadmin;

    if(!props.entity.isOwnedBy(identity)){
        return null
    }

    const component = Mpg.PropsParser.parse($class, props, $params)

    let entityType = props.entity && props.entity.type || props.entity && props.entity.item && props.entity.item.entityType || props.entityType

    

    //edit form
    const [type, setType] = useState(null)

    const form = {
        // model: type && Object.keys(type).reduce((m,k) => {
        //     m[k]=props.entity.item[k]; 
        //     return m;
        // }, {}),
        model: props.entity.item,

        init: async () => {
            if(!type){
                api.get('/types/' + entityType).then(json => {

                    let t = json.data

                    if(props.specialization){
                        if(!t.specializedTypes[props.specialization]){
                            throw new Error(props.entityType + ' type does not have specialized subtype ' + props.specialization)
                        }
                        t.fields = t.specializedTypes[props.specialization]
                    }

                    setType(t)
                })
            }
        },
        ok: async () => {
            api.put('/' + props.entity.type, form.model)
            .then(json => {
                if(!json.ok){
                    alert('Could not update ' + props.entity.type + ' at this time.  Please try again later.');
                }

                if(props.onChange){
                    props.onChange()
                }
            })
            .catch(reason => {
                alert('Could not update ' + props.entity.type + ' at this time.  Please try again later.');
            })
        }
    }

    const editableProps = {}

    if(type){
    
        if(component.fields){
            for(let key of component.fields)  {
                editableProps[key] = type.fields[key]
            }
        }
        else{
            for(let key of Object.keys(type.fields).filter(x=>x[0]!=='_'))  {
                editableProps[key] = type.fields[key]
            }
        }

    }

    const labelsProp = {}
    if(component.labels === false){
        labelsProp.noLabels = true
    }

    if(component.noLabels){
        labelsProp.noLabels = component.noLabels
    }
    
    
    const title = component.title || (type && (type.display.name || type.name))

    return (
        
        <Modal
            button={component.button || (
                <Button variant="link">
                    <Mpg.FontAwesomeIcon icon={['far', 'edit']} size="xs"/>
                </Button>    
            )}
            title={"Edit " + title}
            body={<Form type={editableProps} model={form.model} {...labelsProp}/>}
            onOpen={form.init}
            onOk={form.ok}
        />
    )
}
    
