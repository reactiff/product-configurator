import React from 'react'
import { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button'

import api from '../../shared/Api'
import Mpg from './Mpg'
import Modal from './Modal'
import Form from './Form'

//import './css/_template.css'

const $class = "mpg-add-entity"
const $description = 'Generic dialog for adding new entities'
const $params = {
    entityType: { type: 'string', required: true, example: 'note' },
    button: { type: 'element', example: '<Button variant="secondary"/>' },
    specialization: { type: 'string' },
    parentEntity: { type: 'any' },
    model: { type: 'any' },
    caption: { type: 'string' },
    excludedOptions: { type: 'any' },
    onChange: { type: 'function', required: true, example: '() => handleOnChange()' },
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

    //edit form
    const [type, setType] = useState(null)

    const form = {

        model: {},

        init: async () => {
            if(!type){
                api.getType(props.entityType, props.specialization)
                    .then(t => setType(t))
            }
        },

        ok: async () => {

            if(component.parentEntity){
                form.model.partitionKey = props.parentEntity.id
                form.model.parentType = props.parentEntity.type
                form.model.parentPartition = props.parentEntity.partition
                form.model.parentId = props.parentEntity.id
            }

            if(props.model){
                Object.assign(form.model, props.model)
            }

            api.post('/' + props.entityType, form.model)
            .then(json => {
                if(!json.ok){
                    alert('Unable to add new ' + props.entityType + '.  Please try again later.');
                }

                if(props.onChange){
                    props.onChange()
                }
            })
            .catch(reason => {
                alert('Unable to add new ' + props.entityType + '.  Please try again later.');
            })
        }
    }
    
    
    const caption = props.caption || 'Add ' + props.entityType

    const trigger = props.button || <Button variant="link" size="sm" className="smaller" >+ New</Button>

    return (
        
        <Modal
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 

            icon={props.icon}
            button={trigger}
            title={caption}
            body={<Form type={type} excludedOptions={props.excludedOptions} model={form.model} noLabels />}
            onOpen={form.init}
            onOk={form.ok}
        />
    )
}
    
