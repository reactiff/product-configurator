import React from 'react'
import {useState, useEffect, useRef} from 'react'
import Mpg from './Mpg'

import {Button} from 'react-bootstrap'
import useAppRoot from '../../hooks/useAppRoot'

import './css/disclosureview.css'
import { fnOrValue } from '../../shared/Util'

const NAVBAR_HEIGHT = 74

export default props => {

    const [viewContent, setViewContent] = useState(null);

    const stateRef = useRef({
        opened: false,
        view: null,
    })
    
    const handleCloseView = () => {
        if(stateRef.current){
            if(stateRef.current.view){
                stateRef.current.view.style.transition = 'left 200ms ease-out';
                stateRef.current.view.style.left = '100%';
            }
        }
        setTimeout(() => {
            // if(appRoot){
            //     if(appRoot.isFlowHidden()){
            //         appRoot.setFlowHidden(false);
            //     }
            // }
            stateRef.current.view = null;
            stateRef.current.opened = false;
            props.onClose();
        }, 200)
    }

    const mountedInPortal = (ref) => {
        if(stateRef.current.opened){
            return
        }
        stateRef.current.opened = true;
        const animationDelay = 0; // props.restore ? 0 : 100
        const transitionTime = 200; //props.restore ? 0 : 0.2

        setTimeout((ref)=>{
            ref.current.style.transition = 'left ' + transitionTime.toFixed(1) + 'ms ease-out'
            ref.current.style.left = '0%'
        }, animationDelay, ref)
        
        setTimeout((ref)=>{
            props.onOpen && props.onOpen(handleCloseView)
            setViewContent(fnOrValue(props.children));
        }, animationDelay + transitionTime)

        stateRef.current.view = ref.current;
    }

    /// Called when mounted in the portal
    const main = () => {

        return <div className="disclosure-view-container">

            <div className="disclosure-view-relative-container">

                <Mpg.Flex row padded alignItems="center" className="disclosure-view-header">
                    <Button variant="light" 
                        className="no-padding" 
                        style={{padding: '5px 10px', margin: 0}} 
                        onClick={handleCloseView}>
                        <Mpg.Flex row tight alignItems="center" padded>
                            <Mpg.FontAwesomeIcon icon='chevron-left' size="1x" />
                            {
                                typeof props.header === 'string' &&
                                <Mpg.div grow>{props.header}</Mpg.div>
                            }
                            {
                                typeof props.header !== 'string' &&
                                props.header
                            }
                        </Mpg.Flex>
                    </Button>
                </Mpg.Flex>

                <Mpg.div className="disclosure-view-body scrollable vertical">
                    <div className="container-fluid">
                        {
                            viewContent
                        }
                    </div>
                </Mpg.div>

            </div>
        </div>
    }

    return <Mpg.Portal id="disclosureView" targetContainer="fixedRoot" onMount={mountedInPortal}>
        {main}
    </Mpg.Portal>
}
