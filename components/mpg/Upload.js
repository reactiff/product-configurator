import React, { useState } from 'react'

import api from '../../shared/Api'
import Button from 'react-bootstrap/Button'

import { useIdentity } from '../../hooks/Hooks'
import Mpg from './Mpg'

const $class = "mpg-image-upload"
const $description = 'Uploads one or multiple images to the specified path on CDN.'
const $params = {
    entity: {type: 'any'},
    onUpload: {type: 'function'},
    button: { type : 'any' },
    multiple: { type : 'boolean' },
}

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
        }
    }   
        
    const component = Mpg.PropsParser.parse($class, props, $params)
        
    const [show, setShow] = useState(false)
    const [files, setFiles] = useState(null)

    const path = component.entity.getCdnPath()

    const identity = useIdentity()

    
    const handleUpload = () => {

        const formData = new FormData()

        for(var x = 0; x < files.length; x++) {
            formData.append('file', files[x])
            if(!props.multiple){
                break
            }
        }

        formData.append('path', path);
        formData.append('entityType', props.entity.type);
        formData.append('entityId', props.entity.id);
        
        const methodName = props.multiple ? 'multiple' : 'single'

        api.multipart('/upload/' + methodName, formData).then(response => {

            if(response.ok){
                setShow(false)
    
                if(props.onUpload){

                    //handle the first time a logged on user uploads a picture
                    if(props.entity.id === identity.profile.id && !identity.profile.hasImages) {
                        sessionStorage.setItem('hasImages-' + identity.profile.id, 'true')
                    }

                    props.onUpload()
                }
            }
        })
    }

    const triggerButton = props.button || <Button variant="link" >Upload</Button>
    
    const title = props.multiple ? 'Upload Images' : 'Upload an image'
    return (
        <Mpg.Modal
            show={show}
            button={triggerButton}
            title={title}
            body={
                <>
                    <h5>Target Entity</h5>
                    <Mpg.NameValuePair name="Name" value={props.entity.getName()}/>
                    <Mpg.NameValuePair name="Type" value={props.entity.type}/>
                    <Mpg.NameValuePair name="ID" value={props.entity.id}/>
                    <hr></hr>

                    {
                        !props.multiple && 
                        <input type="file" name="file" onChange={(e) => setFiles(Array.from(e.target.files))} /> 
                    }
                    
                    
                    {
                        props.multiple && 
                        <input type="file" name="file[]" multiple onChange={(e) => setFiles(Array.from(e.target.files))} /> 
                    }

                    <Button variant="primary" onClick={handleUpload}>Upload</Button>
                </>
            }
            onOpen={() => setShow(true)}
            onClose={() => setShow(false)}
        />
        
    )
  
}

