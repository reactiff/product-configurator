import React from 'react'
import {useEffect, useCallback, useRef} from 'react'

import Mpg from './Mpg'

const $class = ""
const $description = 'Div helper'
const $params = {
    editable: { type: 'boolean' },
    onEdit: { type: 'function' }
} 

export default React.forwardRef((props, ref) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => ({
                props: {
                    children: <h1>A</h1>
                }
            })
        }
    }   
    
    const component = Mpg.PropsParser.parse('mpg-div', props, $params)
    
    

    if(component.style && Object.keys(component.style).length) {
        component.other.style = component.style
    }

    if(component.classes && component.classes.length) {
        component.other.className = $class + ' ' + component.classes.join(' ')
    }

    if(component.editable) {
        component.other.contentEditable = true
    }

    
    const isEditable = component.onEdit && true
    let editableRef = useRef();

    const memoizedOnEdit = useCallback(
        (text) => {
            component.onEdit(text);
        },[component]
    );

    //let editableContent = ''
    if(isEditable){
        //editableContent = component.other.children
        //component.other.children = null
        component.other.ref = editableRef
    }

    
    useEffect(()=> {

        if(isEditable){

            //monitor Enter key press
            editableRef.current.addEventListener('blur', (e) => {

                if (!e) {
                    e = window.event;
                }

                // if (e.keyCode === 13) {

                    const text = e.target.innerText

                    memoizedOnEdit(text)

                    e.preventDefault()
                    return false
                // }

            })

            editableRef.current.addEventListener('keypress', (e) => {

                if (!e) {
                    e = window.event;
                }

                if (e.keyCode === 13) {

                    const text = e.target.innerText

                    memoizedOnEdit(text)

                    e.target.blur()

                    e.preventDefault()
                    return false
                }

            })

            //ref.current.innerHTML = editableContent
        }

    }, [isEditable, editableRef.current, memoizedOnEdit])

    if(component.tabIndex){
        debugger
    }
    
    return (
        <div 
            ref={ref}
            {...component.other}
            style={component.style}
            className={component.classes.join(' ')} 
        >
            
        </div>
    )
    
})
