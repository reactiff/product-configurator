import React from 'react'
import {useEffect, useState, useRef} from 'react'

import ReactDOM from 'react-dom'

//import './css/portal.css'

import Mpg from './Mpg'
import { fnOrValue } from '../../shared/Util'

const $class = "mpg-portal"
const $description = 'Mpg.Portal uses React Portals, enabling you to render components ANYWHERE in the DOM'
const $params = {
    id: { type: "string", description: "Identifier for the component's container" },
    targetContainer: { type: "string", description: "Target container ID string" },
    onMount: {type: 'function'},
    data: { type: 'element' },
    createRef: {type: 'boolean'}
}

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            isPortal: true,
            getSampleData: () => ({

                "props" : {
                    id: 'portalDemo',
                    targetContainer: 'portalContainer',
                    data : (
                        <Mpg.Panel>
                            <h1>I am Mpg.Portal</h1>
                            <h5>Look what I can do!</h5>
                        </Mpg.Panel>
                    )
                }

            })
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    const childRef = useRef()
    const [targetContainerElement, setTargetContainerElement] = useState(null)

    useEffect(()=>{

        

        if(!targetContainerElement){
            let target
            if(typeof component.targetContainer === 'string'){
                target = document.getElementById(component.targetContainer)
            } else {
                target = component.targetContainer
            }
        
            if(!target){
                return
            }

            setTargetContainerElement(target)
            return
        }

        
        
    }, [childRef.current])


    if(!targetContainerElement){
        return null
    }
    
    let componentContainer
    if(component.id) {
        componentContainer= document.getElementById(component.id)
    }

    if(!componentContainer){
        var node = document.createElement("div");                 
        node.id = component.id
        node.className = $class + ' ' + component.classes.join(' ')
        targetContainerElement.appendChild(node);
        componentContainer = document.getElementById(component.id)
    }

    const awaitMount = () => {
        if(childRef.current){
            if(props.onMount){
                props.onMount(childRef)
            }
            return 
        }
        requestAnimationFrame(awaitMount)
    }

    if(props.onMount){
        const childElement = fnOrValue(component.data)
        const withRef = React.cloneElement(childElement, {ref: childRef})
        requestAnimationFrame(awaitMount)
        return ReactDOM.createPortal(withRef, componentContainer);
    }
    else{
        const childElement = fnOrValue(component.data)
        return ReactDOM.createPortal(childElement, componentContainer);
    }

    
}
    