import React from 'react'
import {useState, useEffect} from 'react'

import uuid from 'uuid/v4'

import './css/radialspread.css'

import Mpg from './Mpg'

const $class = "mpg-radial-spread"
const $description = 'Renders children around its center with equal radius'
const $params = {
    radius: { type: 'number', description: 'Distance from center'},
    degrees: { type: 'number', description: 'Absolute degrees of spread between items in degrees.  If omitted, items will be equally spread around the circle.' },
    offsetDegrees: { type: 'number', description: 'Angular offset.' },
    placement: { type: 'string', description: 'Top or botttom', options: 'top|bottom'},
    direction: { type: 'string', description: 'Direction of spread.  Default is ltr (left to right)', options: 'ltr|rtl'},
    animateRotation: { type: 'object', description: 'Animated rotation parameter', example: '{ degrees: 45, duration: 2000, easing: "linear"}'},
} 

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({

                props: {
                    width: 200,
                    height: 200,
                    radius: 100,
                    degrees: 7,
                    direction: 'ltr',
                    placement: 'top',
                    children: '555pts'.split('')
                        
                }
                
            })
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    

    let degrees = 360 / component.data.length
    
    if(component.degrees && component.degrees !== 'auto'){
        degrees = component.degrees
    } 
    
    let placement = 'bottom'
    if(component.placement){
        placement = component.placement
    } 

    let directionFactor = 1 | -1

    const direction = component.direction || 'ltr' 

    if(placement === 'bottom') {
        directionFactor = direction === 'ltr' ? -1 : 1
    }
    else{
        directionFactor = direction === 'ltr' ? 1 : -1
    }

    const offset = component.offsetDegrees || 0

    let items = component.data


    const guid = '$' + uuid()

    const rotation = {}
    if(component.animateRotation){
        rotation.transform = 'rotate('+component.animateRotation.degrees.toFixed(0)+'deg)'
        rotation.transitionDuration = component.animateRotation.duration.toFixed(0) + 'ms'
        rotation.transitionTimingFunction = component.animateRotation.easing
    }
    
    useEffect(()=>{

        const tryRemoveTransformBlock = () => {

            const elem = document.getElementById(guid)

            if(elem){
                elem.className = ''
                return
            }
            else{
                setTimeout(() => {
                    tryRemoveTransformBlock()
                }, 200)
            }
        }


        setTimeout(() => {
            tryRemoveTransformBlock()
        }, 100)
        
    }, [guid])

    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >

            {/* ROTATING PLATE */}
            <Mpg.Abs
                id={guid}
                width={component.style.width}
                height={component.style.height}
                className={`no-transform`}

                style={rotation}

            >

                {
                    items.map((x,i) => {

                        const style = {
                            transform: 'rotate(' + (directionFactor * (degrees * i + offset) ) + 'deg)',
                            height: component.radius
                        }

                        if(placement==='bottom'){
                            style.top = component.style.height / 2
                        }
                        else{
                            style.bottom = component.style.height / 2
                        }
                        
                        return (
                            <div key={i} style={style} className={'petal ' + placement}>
                                <div className="petal-item">
                                    {x}
                                </div>
                            </div>
                        )

                    })
                }
            
            </Mpg.Abs>

            
        </div>
    )

}
    
