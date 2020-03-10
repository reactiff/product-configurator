import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Mpg from './Mpg'

import './css/actionbutton.css'

const $class = "mpg-action-button"
const $description = 'An animated action button, which handles the success and error state'
const $params = {
    onClick: {type: 'function'}
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

    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [working, setWorking] = useState(false)
    
    let buttonVariant = success ? 'success' : 'primary'

    if(working){
        component.classes.push('working')
    }
    else if(error){
        component.classes.push('error')
    }

    return (
        
        <Mpg.Flex row tight padded alignItems="center"
            {...component.other}
            style={component.style}
            className={$class} 
            >

            {
                error && 
                <Mpg.div>
                    Failed
                </Mpg.div>
            }
            {
                success && 
                <Mpg.div>
                    Great success!
                </Mpg.div>
            }


            <Button variant={buttonVariant} className={'action ' + component.classes.join(' ')} size="sm" 
                onClick={async () => {
                    setError(null)
                    setWorking(true)
                    const result = await props.onClick()
                        .catch(error => {
                            setWorking(false)
                            setError(error)
                        })
                    if(result){
                        setSuccess(true)
                    }
                    setWorking(false)
                }}
            >
                {
                    !working && !error && 
                    <>
                        {
                            typeof props.children === 'string' ? props.children + (success ? ' again' : '') : props.children 
                        }
                    </>
                }
                {!working && error && 'Try again'}
                {working && 'Working...'}
            </Button>
        </Mpg.Flex>

    )
}

