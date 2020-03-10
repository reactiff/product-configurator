import React from 'react'

import {Button} from 'react-bootstrap'

import Mpg from './Mpg'

import './css/profilecard.css'

// import sampleProfile from './data/teachers/profile1'
import Entity from '../../shared/Entity'

const $class = "mpg-profile-card"
const $description = 'Profile card, displaying a thumbnail and name on the left, with content on the right'
const $params = {
    entity: { type: 'object', description: 'Entity wrapped object' },
    role: {type: 'string', description: 'Role of the person' }
} 

export default (props) => {

    // if(!props){
    //     return {
    //         description: $description,
    //         params: $params,
    //         class: $class, 
    //         getSampleData: () => {
    //             const entity = new Entity('profile', sampleProfile)
    //             return {
    //                 props: {
    //                     entity: entity,
    //                     children: (
    //                         <>
    //                             <h2>{entity.getName()}</h2>
    //                             <Mpg.MultiColumnList xs={1} sm={1} md={1} lg={2} xl={2}>
    //                                 {entity.getDescription(200)}
    //                             </Mpg.MultiColumnList>
    //                         </>
    //                     )
    //                 }
    //             }

    //         }
    //     }
    // }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >

            <Mpg.Flex row noMargin alignItems="center">

                <Mpg.Thumbnail size={60} entity={component.entity}></Mpg.Thumbnail>

                <Mpg.div grow padding="0 15px" tight style={{fontSize: '2vh'}}>

                    {component.entity.getName()}

                </Mpg.div>
                    
                <Mpg.div>
                    {component.children} 
                </Mpg.div>

            </Mpg.Flex> 


        </div> 
    )
}
    