import React from 'react'

//import { useBootstrapGridSize } from '../../Hooks/Hooks'

import Mpg from './Mpg'

// import './css/_template.css'

const $class = "mpg-stars"
const $description = 'Star rating'
const $params = {
    rating: { type: 'number' },
    max: { type: 'number', default: 5 },
    halfStar: { type: 'boolean', default: true }
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

    const component = Mpg.PropsParser.parse($class, props, $params)

    const wholeStars = Math.min(Math.floor(component.rating), component.max)
    const halfStars = component.halfStar && wholeStars < component.rating && wholeStars < component.max ? 1 : 0
    const emptyStars = Math.max(component.max - (wholeStars + halfStars), 0)

    const stars = [];

    stars.push(...Array.from({length: wholeStars}).map((_, index) => 
        <Mpg.FontAwesomeIcon key={index} icon={['fas', 'star']} className="color-bright" />
    ));

    stars.push(...Array.from({length: halfStars}).map((_, index) => 
        <Mpg.FontAwesomeIcon key={index} icon={['fas', 'star-half-alt']} className="color-bright"/>
    ));

    stars.push(...Array.from({length: emptyStars}).map((_, index) => 
        <Mpg.FontAwesomeIcon key={index} icon={['far', 'star']} className="color-shaded"/>
    ));

    return stars;

    return (
        <Mpg.Flex row tight justifyContent="center"
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            >
            
            {
                Array.from({length: wholeStars}).map((_, index) => <Mpg.FontAwesomeIcon key={index} icon={['fas', 'star']} className="color-bright" />)
            }

            {
                Array.from({length: halfStars}).map((_, index) => <Mpg.FontAwesomeIcon key={index} icon={['fas', 'star-half-alt']} className="color-bright"/>)
            }

            {
                Array.from({length: emptyStars}).map((_, index) => <Mpg.FontAwesomeIcon key={index} icon={['far', 'star']} className="color-shaded"/>)
            }
            

        </Mpg.Flex>
    )
}
    
