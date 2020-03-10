import React from 'react'

import Mpg from './Mpg'

import './css/stack.css'

// import sampleProfile from './data/teachers/profile1'
import Entity from '../../shared/Entity'
import { fnOrValue } from '../../shared/Util'

// METADATA
const $class = "mpg-stack"
const $description = 'Creates a stack of absolutely positioned layers.'
const $params = {
}

export default (props) => {

    // if(!props){
    //     return {
    //         description: $description,
    //         params: $params,
    //         class: $class,
    //         getSampleData: () => {

    //             const size = 200;
    //             const entity = new Entity('profile', sampleProfile)

    //             return {
    //                 props: {
    //                     className: 'round',
    //                     bgColor: 'white',
    //                     width: size,
    //                     height: size,
    //                     children: [
                            
    //                         <Mpg.RadialSpread 
    //                             width={size}
    //                             height={size}
    //                             radius={size/2} 
    //                             degrees={7} 
    //                             placement={'bottom'} 
    //                             direction={'ltr'}
    //                             data={'Silver Member'.split('')} />,

    //                         <Mpg.Thumbnail 
    //                             size={size * 0.85}
    //                             entity={entity.getMetadata()} 
    //                         ></Mpg.Thumbnail>    
                            
    //                     ]
                        
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
            
            {component.data.map((item, i) => {
                return (
                    <div key={i} className="stack-layer" >

                        <Mpg.Tag as="div" absolute left={`calc(50% - ${item.props.width / 2}px)`} top={`calc(50% - ${item.props.height / 2}px)`}>
                            {fnOrValue(item)}    
                        </Mpg.Tag> 
                        
                    </div>
                )
            })}
            
        </div>
    )
}

