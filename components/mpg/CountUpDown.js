import React from 'react'

import { useState, useEffect } from 'react'

import Easing from '../../shared/Easings'

import Mpg from './Mpg'

import './css/countupdown.css'


const $class = "mpg-countupdown"
const $description = 'Animated counter'
const $code = `<Mpg.CountUpDown
    start={0}
    end={10000}
    delay={0}
    duration={5000}
    easing="easeInOutCubic"
    format={(x) => x.toFixed(2)}
/>`
const $params = {
    start: {type: 'number', description: 'Starting value'},
    end: {type: 'number', description: 'Final value'},
    delay: { type: 'number', description: 'Delay in milliseconds before counting begins'},
    duration: { type: 'number', description: 'Total duration in milliseconds'},
    easing: { type: 'string', description: 'Easing function for ramping. The default is "linear"'},
    format: { type: 'function', description: 'A function accepting the value as a single parameter and returning the desired format, e.g. (value) => format(value)' }
} 

export default (props) => {

    if(!props){
        return {
            code: $code,
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({

                props: {
                    start: 0,
                    end: 100,
                    delay: 0,
                    duration: 5000,
                    easing: 'easeInOutCubic',
                    format: (value) => <h1>{value.toFixed(0) + ' pts.'}</h1>,
                    fontSize: '1em'
                }
                
            })
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)

    // const [ready, setReady] = useState(false)
    // const [started, setStarted] = useState(false)
    // const easingFn = Easing[component.easing || 'linear']

    const [easedValue, setEasedValue] = useState(component.end || component.start);

    //Default format function
    if(!component.format){
        component.format = (v) => v
    }

    // if(ready){
    //     if(!started){
    //         setStarted(true)
    //         var startTime = null
    //         const calculateValueAtTime = (timestamp) => {
    //             if(!startTime) {
    //                 startTime = timestamp
    //             }

    //             const t = (timestamp - startTime) / component.duration
    //             const easing = easingFn(t)

    //             setEasedValue(component.start + (component.end - component.start) * easing)

    //             if(t<1){
    //                 requestAnimationFrame(calculateValueAtTime)
    //             }
    //         }
    //         //start after initial delay
    //         setTimeout((v)=> {
    //             requestAnimationFrame(calculateValueAtTime)    
    //         }, component.delay || 0)
    //     }
    // }
    
    // useEffect(()=>{
    //     if(!started){
    //         setReady(true)
    //     }
    // }, [started])
    
    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >
            {component.format(easedValue)}
            {/* {component.format(component.end)} */}
            
        </div>
    )

}
    
