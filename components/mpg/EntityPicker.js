import React from 'react'
import { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button'

import api from '../../shared/Api'
import Mpg from './Mpg'
import Modal from './Modal'
import Form from './Form'

import './css/entitypicker.css'

const $class = "mpg-entity-picker"
const $description = 'Generic dialog for selecting entities'
const $params = {
    caption: { type: 'string', description: 'Button caption' },
    title: { type: 'string', description: 'Dialog title' },
    entityType: {type: 'string'},
    params: {type: 'any'},
    onSelect: { type: 'function'},
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
    
    const [showModal, setShowModal] = useState(false)
    
    const elementForItem = (entity, index) => {

        const {item} = entity

        return (
            <button className="block inverting" onClick={async () => {
                await props.onSelect(item)
                setShowModal(false)
            }}>
                <Mpg.Flex 
                    className='entity-picker-item'
                    row 
                    marginBottom={1}
                >
                    <Mpg.div paddingTop="5px">
                        <Mpg.FontAwesomeIcon icon={['fas','cube']}/>
                    </Mpg.div>

                    <Mpg.Flex grow column padding="5px 10px" noMargin>
                        <h4>{entity.getName()}</h4>
                    </Mpg.Flex>
                    
                </Mpg.Flex>
            </button>
        )
    }

    const list = (
        <Mpg.CrudList 
            allow="r" 
            search 

            noCount
            noTitle
            entityType={component.entityType}
            params={component.params}
            parentEntity={component.parentEntity}

            // title={props.title}
            // pluralTitle={props.title}
            
            elementForItem={elementForItem}
        />
                      
    )

    
    

    return (
        
        <Modal
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 

            title={props.title}
            body={list}

            button={<Button variant="link" size="sm">{props.caption || 'Select'}</Button>}
            onOpen={() => setShowModal(true)}
            onClose={() => setShowModal(false)}

            show={showModal}
        />
    )
}
    
