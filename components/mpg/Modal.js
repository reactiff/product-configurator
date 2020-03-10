import React from 'react'
import {useState} from 'react'

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Mpg from './Mpg'

import './css/modal.css'

const $class = "mpg-modal"
const $description = 'Modal dialog'
const $params = {
  button: {type: 'any', description: 'Optional'},
  caption: {type: 'string'},
  title: {type: 'any'},
  body: {type: 'any'},
  onOpen: {type: 'function'},
  onClose: {type: 'function'},
  onOk: {type: 'function'},
  onCancel: {type: 'function'},
  show: {type: 'boolean'},
  externalState: {type: 'boolean'},
  noButton: {type: 'boolean'}
}

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class
        }
    }   
        
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    const [shown, setShown] = useState(false)

    let modalState = false;
    
    if(props.hasOwnProperty('externalState')){
      modalState = component.externalState;
    }
    else{
      modalState = props.hasOwnProperty('show') ? component.show : shown;
    }
    

    const handleOpen = (e) => {
      e.preventDefault()
      if(component.onOpen){
        component.onOpen()
      }
      setShown(true)
    }

    const handleOk = (e) => {
      e.preventDefault()
      if(component.onOk){
        component.onOk()
      }
      setShown(false)
    }

    const handleClose = (e) => {
      if(e) {
        e.preventDefault()
      }
      if(component.onClose){
        component.onClose()
      }
      setShown(false)
    }

    let openButton = null;

    if(!props.noButton){
      if(component.button) {
        openButton = React.cloneElement(component.button, {onClick: handleOpen})
      }
      else{
        openButton = <Button variant="primary" size="sm" onClick={handleOpen}>{component.caption || 'Open...'}</Button>
      }
    }
    


    return (

      <>

        {openButton}

        
        <Modal
          show={modalState}
          keyboard={true}
          size="md"
          onHide={handleClose}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {props.icon}
              {component.title}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {component.body || component.children}
          </Modal.Body>

          <Modal.Footer>

            {

              props.onOk && (
                <Button variant="primary" onClick={(e) => handleOk(e)}>
                  OK
                </Button>
              )

            }
            
            <Button variant="secondary" onClick={(e) => handleClose(e)}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>
      </>
    );
  }
  
  