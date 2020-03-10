import React, { useState } from 'react'
import Mpg from './Mpg'

import Entity from '../../shared/Entity'

import {Button} from 'react-bootstrap'

import { withRouter } from 'react-router-dom'

import './css/entitylink.css'

const $class = "mpg-entity-link no-br"
const $description = 'Link to open entity view page'
const $params = {
    entity: { type: 'any', required: true },
    entityType: { type: 'string' }
}

const EntityLink = (props) => {

    //If no props, return metadata
    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({
                props: {
                    entity: new Entity('entityType', {id: 'item_id'})
                }
            })
        }

    }   

    const component = Mpg.PropsParser.parse($class, props, $params)

    const {history, location, match, staticContext, ...other} = component.other

    const resolvedType = component.entityType || component.entity.entityType || component.entity.type

    return (
        <Button 
            variant="link" 
            {...other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            onClick={() => props.history.push('/view/' + resolvedType + '/' + component.entity.id)}
        >
            {props.children}
        </Button>
    )
}
    
export default withRouter(EntityLink)