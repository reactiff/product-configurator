import React from 'react'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faImage } from '@fortawesome/free-solid-svg-icons'

import Mpg from './Mpg'

const $class = "mpg-"
const $description = ''
const $params = [] 
const $examples = []

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            examples: $examples,
            class: $class
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)

    return (
        

        <div className='button'>
            
        </div>

        // <div>
        //     <div className='button'>
        //         <label htmlFor='multi'>
        //             <FontAwesomeIcon icon={faImages} color='#6d84b4' size='10x' />
        //         </label>
        //         <input type='file' id='multi' onChange={props.onChange} multiple />
        //     </div>
        // </div>

    )
}