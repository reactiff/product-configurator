import React from 'react'
import { useState, useEffect } from 'react'

//import { useBootstrapGridSize } from '../../hooks/Hooks'

//import { Inline } from '../../Util'

import { useIdentity } from '../../hooks/Hooks'

import Mpg from './Mpg'
import Entity from '../../shared/Entity'

// import sampleProfile from './data/teachers/profile1'

import './css/thumbnail.css'

const $class = "mpg-thumbnail"
const $description = 'Displays an thumbnail associated with an entity on CDN.  '
const $params = {
    entity: { type: 'object', description: 'Entity owner of the thumbnail' }, 
    size: { type: 'number', default: 120 }, 
    borderRadius: { type: 'cssunits', default: '50%' },
    dropShadow: {type: 'boolean'},
    noUpload: {type: 'boolean'},

    background: {type: 'boolean'},
    backgroundColor: {type: 'csscolor'},
    backgroundSize: {type: 'cssunits'},
}

function sizeMultiplier(size){

    const unit = 20

    for(let i = 1; i <= 10; i++){
        if(size > i * unit && size <= (i+1) * unit ){
            return i + "x"
        }
    }

    return "1x"
    
}

export default (props) => {

    // if(!props){
    //     return {
    //         description: $description,
    //         params: $params,
    //         class: $class,
    //         getSampleData: () => ({
    //             entity: new Entity('profile', sampleProfile)
    //         })
    //     }
    // }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)
    
    if(!props.entity){
        return (
            <Mpg.Flex tight size={component.size} justifyContent="center" alignItems="center" className="placeholder">
                <Mpg.FontAwesomeIcon icon="user" size={sizeMultiplier(component.size)}/>
            </Mpg.Flex>
        )
    }
    
    
    
    const [imageError, setImageError] = useState(false)
    const [revision, setRevision] = useState(0)
    const [imageUrl, setImageUrl] = useState(null)

    useEffect(()=>{

        let recentImages = false;
        
        if(identity && identity.profile && !identity.profile.hasImages){
            if(component.entity.id === identity.profile.id) {
                recentImages = sessionStorage.getItem('hasImages-' + component.entity.id) === 'true'
            }
        }

        const url = component.entity.getCdnUrl() + 
            '/' + '180x180' + 
            '?r='+revision;
        setImageUrl(url)

    }, [props.entity.type, props.entity.id, revision])

    let img = {};
    
    const identity = useIdentity()
    if(component.entity.isOwnedBy(identity) && !component.noUpload){
        img.upload = (
            <Mpg.Upload 
              entity={component.entity}
              button={<button className="mpg-thumbnail-upload-btn transparent">
                  <Mpg.FontAwesomeIcon icon="upload"></Mpg.FontAwesomeIcon>
              </button>}
              onUpload={()=>{ 
                setRevision(revision+1) 
              }} 
            />
        )
    }

    const imgStyle = {}
    const placeholderStyle = {}

    if(component.style.width){
        imgStyle.width = component.style.width
    }
    if(component.style.height){
        imgStyle.height = component.style.height
    }
    
    const handleImageError = (e) => {
        setImageError(true)
        e.preventDefault();
    }

    imgStyle.borderRadius = component.style.borderRadius
    placeholderStyle.borderRadius = component.style.borderRadius
    
    if(component.dropShadow){
        imgStyle.boxShadow = '0px 0px 30px 0px rgba(0, 0, 0, 0.8)'
    }


    return (

        <Mpg.Flex 
            tight
            row
            justifyContent="center"
            alignItems="center"
            {...component.other}
            style={component.style}
            className={"mpg-thumbnail " + component.classes.join(' ')} 
            relative>

            {

                props.background && 
                <Mpg.div 
                    className={'thumbnail-background'} 
                    bgColor={props.backgroundColor} 
                    size={props.backgroundSize} />
            }

            {
                imageUrl && 
                !imageError &&
                <img
                    className={'thumbnail-image'} 
                    style={imgStyle}
                    alt="Thumbnail"
                    src={imageUrl}
                    onError={handleImageError}
                />
            }
            
            {
                (!imageUrl || imageError) && 
                <Mpg.Flex tight size={component.size} justifyContent="center" alignItems="center" 
                    style={placeholderStyle}
                    className="placeholder"
                >
                    <Mpg.FontAwesomeIcon icon="user" size={sizeMultiplier(component.size)}/>
                </Mpg.Flex>
            }


            {img.upload}

        </Mpg.Flex>
    )
        
    
}
    