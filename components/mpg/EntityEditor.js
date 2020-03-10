import React from 'react'
import { useState, useEffect } from 'react'

//import { useBootstrapGridSize } from '../../Hooks/Hooks'

import {Button} from 'react-bootstrap'

import Format from '../../shared/Format'

import { Inline } from '../../shared/Util'
import { DateUtil } from '../../shared/Util'
import { TimeUtil } from '../../shared/Util'
import { ArrayUtil } from '../../shared/Util'

import api from '../../shared/Api'

import Mpg from './Mpg'

import './css/entityeditor.css'

const $class = "mpg-entity-editor"
const $description = ''
const $params = {

    entity: { type: 'any' },
    updateEntity: { type: 'function' },
    entityType: { type: 'string'},
    specialization: { type: 'string' },
    groups: {type: 'any', description: 'Map of fields arrays.  Array key is the group name.' },
    noLabels: { type: 'boolean', default: false}
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

    const [type, setType] = useState(null)

    useEffect(()=>{
        api.getType(props.entityType, props.specialization)
            .then(t => 
                setType(t)
                )
            .catch(reason => 
                alert(reason.message)
            )
    },[props.entity.item.entityType])

    const component = Mpg.PropsParser.parse($class, props, $params)

    if(!type){
        return null
    }

    if(props.noLabels){
        component.classes.push('no-labels');
    }

    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            >
            
            {
                Object.keys(component.groups).map((group)  => {

                    const fields = component.groups[group]

                    const fieldGroupClasses = ['field-group', component.noLabels ? 'unlabeled-fields' : 'labeled-fields']
                    

                    return <Mpg.Flex key={group} column solid className={fieldGroupClasses.join(' ')}>
                        
                        <Mpg.Flex noPadding className="group-label">
                            <Mpg.div grow shaded smaller>
                                {group.camelToSentenceCase().toUpperCase()}
                            </Mpg.div>
                            
                            <Mpg.CrudEditEntity
                                button={<Button variant="link" className="no-padding">Edit</Button>}

                                entityType={component.entityType}
                                specialization={component.specialization}
                                entity={props.entity}
                                fields={fields}
                                title={group.camelToSentenceCase()}
                                noLabels
                                onChange={()=>
                                    props.updateEntity && props.updateEntity()
                                }
                            />


                        </Mpg.Flex>
                        

                        {
                            fields.map((key, index) => {

                                const fieldMap = type.fields || type

                                const fld = fieldMap[key]

                                if(!fld){
                                    debugger
                                    console.log(key + ' is not a field of type ' + type.name)
                                }

                                const dataType = fld.type
                                const value = props.entity.item[key]
                                const formattedValue = Format.displayFormat(value, dataType)

                                return <Mpg.Flex key={index} row padded className="group-field" alignItems="center">
        
                                    {
                                        !component.noLabels &&
                                        <Mpg.div className="group-field-label">
                                            {key.camelToSentenceCase()}
                                        </Mpg.div>
                                    }
                                    

                                    <Mpg.div className={"group-field-value " + dataType}>{formattedValue || <span>&nbsp;</span>}</Mpg.div>
        
                                </Mpg.Flex> 
        
                            })
                        }
                    </Mpg.Flex>
                    
                    
                    


                })
            }

        </div>
    )
}
    
