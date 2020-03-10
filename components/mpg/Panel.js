import React from 'react'

import './css/panel.css'

import Mpg from './Mpg'

const $class = "mpg-panel"
const $description = 'A panel with padding, typically with white background, used as a container for widgets on the page when you have a non-white or textured background'
const $params = {}


export default (props) => {

    //If no props, return metadata
    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => {
                return (
                    <>
                        <h2>Heading</h2>
                        <hr></hr>
                        <p>
                            {Mpg.LoremIpsum.generateParagraphs(1)}
                        </p>
                        <p>
                            {Mpg.LoremIpsum.generateParagraphs(1)}
                        </p>
                        <p>
                            {Mpg.LoremIpsum.generateParagraphs(1)}
                        </p>
                        <hr></hr>
                    </>
                )
            }
        }

    }   

    const component = Mpg.PropsParser.parse($class, props, $params)

    return (
        <div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
        >
            {component.data}
        </div>
    )
}
    