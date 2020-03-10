import React from 'react'
import {useState} from 'react'
// import {useLocation} from 'react-router-dom'

import Mpg from './Mpg'
import DisclosureView from './DisclosureView'

// import useAppRoot from '../../hooks/useAppRoot'

import './css/disclosure.css'

const $class = "mpg-disclosure block transparent inverting"
const $description = 'Disclosure button, which opens an overlay view with back button'
const $params = {
    caption: {type: 'string'},
    active: {type: 'boolean'},
    // transparent: {type: 'boolean'},

    viewKey: {type: 'string'},

    icon: {type: 'string'},
    iconSize: {type: 'string', default: '1x'},

    shortcutKey: {type: 'string'},
    iconElement: {type: 'any'},

    onClick: {type: 'function'},
    onOpen: {type: 'function'},
    onClose: {type: 'function'},
    header: { type: 'any' },

    action: {type: 'function'},
    show: {type: 'boolean'},
    inline: {type: 'boolean'},
    noChevron: {type: 'boolean'},
}
/**
 * @param {{caption: string, icon: string, iconSize: string, content: any}} props 
 */
export default (props) => {

    const component = Mpg.PropsParser.parse($class, props, $params);
    const [viewOpen, setViewOpen] = useState(false);

    const handleOpenView = () => {

        props.onOpen && props.onOpen()

        if(props.onClick){
            props.onClick();
            return;
        }

        if(props.children){
            setViewOpen(true)
        }
        
    }

    const handleViewOpened = (closeView) => {
        
        
    }

    const handleViewClosed = () => {
        setViewOpen(false)
        //sessionStorage.setItem(disclosureViewHash, false)
        props.onClose && props.onClose()
    }

    if(props.inline){
        component.style.display = 'inline-flex';
    }

    const iconClass = props.active ? 'active' : ''
    return <>

        {
            !props.action &&
            !props.transparent &&
            <button 
                className={$class} 
                onClick={handleOpenView}
                >
                <Mpg.Flex row solid padded alignItems="flex-start" marginBottom={1} {...component.other} style={component.style} className={component.classes.join(' ')}>   
                    {
                        // props.icon &&
                        // <Mpg.div width={20} textAlign="center">
                        //     <Mpg.FontAwesomeIcon icon={component.icon} size={component.iconSize} className={iconClass}/>
                        // </Mpg.div>
                    }

                    {
                        props.iconElement && 
                        <Mpg.div>
                            {props.iconElement}
                        </Mpg.div>
                    }

                    <Mpg.div grow>
                        {component.caption}
                    </Mpg.div>

                    {
                        !component.noChevron &&
                        props.children &&
                        <Mpg.div>
                            &#8594;
                            {/* <Mpg.FontAwesomeIcon icon="chevron-right"/> */}
                        </Mpg.div>
                    }
                    
                </Mpg.Flex>
            </button>
        }

        {
            props.action &&
            <Mpg.Flex row solid padded alignItems="center" marginBottom={1} {...component.other} style={component.style} className={component.classes.join(' ')}>   
                {
                    props.icon &&
                    <Mpg.div width={20} textAlign="center">
                        <Mpg.FontAwesomeIcon icon={component.icon} size={component.iconSize} className={iconClass}/>
                    </Mpg.div>
                }

                {
                    props.iconElement && 
                    <Mpg.div>
                        {props.iconElement}
                    </Mpg.div>
                }

                <Mpg.div grow>
                    {component.caption}
                </Mpg.div>

                {
                    <Mpg.ActionButton onClick={async () => {
                        
                        const result = await component.action().catch(err => {
                                throw new Error(err.message)
                            })        

                        if(!result.ok){
                            return false
                        }

                        return true
                        
                    }}>
                        {component.caption.camelToSentenceCase().split(' ')[0]}
                    </Mpg.ActionButton>
                    
                
                }
                
            </Mpg.Flex>
        
        }
       
        
        {
            props.transparent &&
            <button 
                {...component.other} style={component.style} className={$class + ' ' + component.classes.join(' ')}
                onClick={handleOpenView}
                >

            </button>
        }

        {
            viewOpen && 
            props.children && 
            <DisclosureView
                header={props.header}
                onOpen={handleViewOpened}
                onClose={handleViewClosed}
                // restore={restoreView}
                
                >
                {props.children}
            </DisclosureView>
        }
    </>
}
    
