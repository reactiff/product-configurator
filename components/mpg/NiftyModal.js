import React from 'react'
import { useState, useEffect } from 'react'

import Button from 'react-bootstrap/Button'

// import { useBootstrapGridSize } from '../../Hooks/Hooks'

//import { Inline } from '../../Util'
//import { DateUtil } from '../../Util'
//import { TimeUtil } from '../../Util'
//import { ArrayUtil } from '../../Util'

//import Config from '../../Config'
//import api from '../../Api'

import Mpg from './Mpg'

import './css/niftymodal.css'


const effects = Array.from({length: 19}).map((_,i)=>i+1);

const $class = "md-modal"
const $description = 'Modal dialogs with nifty effects'
const $params = {
    button: { type: 'string' },
    title: { type: 'string' },
    body: { type: 'any' },
    effect: { type: 'number', options: effects },
    perspective: { type: 'boolean' }
} 

export default (props) => {
    
    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => {
                return effects.map((effect, index) => (
                    <Mpg.NiftyModal 
                        key={index}
                        button={<Button variant="primary" size="sm" style={{margin: 1}}>{'Effect ' + (index+1)}</Button> }
                        effect={index+1}  
                        title={'Modal Dialog ' + index+1} 
                        body={Mpg.LoremIpsum.generateParagraphs(1)}
                        
                        >
                        
                    </Mpg.NiftyModal>
                ))
            }
        }
    }   
    
    const [shown, setShown] = useState(false)

    const component = Mpg.PropsParser.parse($class, props, $params)
    
    ///

    const handleOpen = (e) => {

        setShown(true)

        if(component.perspective){
            setTimeout( function() {

                const name = 'md-perspective'
                const arr = document.documentElement.className.split(" ")

                if (arr.indexOf(name) === -1) {
                    document.documentElement.className += " " + name
                }
                
            }, 25 );
        }
        
    }
    const handleClose = (e) => {
        
        e.stopPropagation()
        
        setShown(false)

        if(component.perspective){
            document.documentElement.className = document.documentElement.className.replace(/\bmd-perspective\b/g, "")
        }

    }

    const openButton = React.cloneElement(component.button, {onClick: handleOpen})

    const classes = [$class, 'md-effect-' + component.effect]

    if(shown){
        classes.push('md-show')
    }

    return (
        <>
            {openButton}

            <div 
                className={classes.join(' ')}>

                <div className="md-content">
                    <div className="md-header">
                        {component.header}
                    </div>
                    <div>
                        {component.body}
                    </div>
                    <div className="md-footer">
                        {component.footer}
                        <Button variant="outline-dark" className="md-close" onClick={handleClose}>Close me!</Button>
                    </div>
                </div>
                
            </div>

            {shown && <div className="md-overlay" onClick={handleClose}></div>}
            
        </>
    )
}
    