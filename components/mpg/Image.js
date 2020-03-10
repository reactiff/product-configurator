import React from 'react'
import { useState, useEffect } from 'react'

import { useBootstrapGridSize, useIdentity } from '../../hooks/Hooks'
import Mpg from './Mpg'
import Entity from '../../shared/Entity'
import { Inline } from '../../shared/Util'

// import sampleProfile from './data/teachers/profile1'
import PropsParser from './modules/PropsParser'

import './css/image.css'

const $class = "mpg-image"
const $description = 'Displays an image, from the given url OR associated entity'
const $params = {
    entity: { type: 'object', description: 'Entity, owner of the image' },
    url: { type: 'string' },
    filter: { type: 'string', select: PropsParser.keyValueStyle },   
    original: { type: 'boolean' },
    cover: { type: 'boolean' },
    noUpload: {type: 'boolean'},
    revision: { type: 'number', default: 0 }
}

/**
 * @param {{entity: any, url: string, cover: boolean, revision: number}} props 
 */
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
    
    if(!props.entity && !props.url){
        return null
    }

    const component = Mpg.PropsParser.parse($class, props, $params)
    
    const [imageError, setImageError] = useState(false)
    const [revision, setRevision] = useState(0)
    const [imageUrl, setImageUrl] = useState(null)

    const gridSize = useBootstrapGridSize()

    const entityType = props.entity && props.entity.type
    const entityId = props.entity && props.entity.id
    const compoundRevision = component.revision + revision

    useEffect(()=>{

        const imgSize = ''

        if(props.url){
            setImageUrl(props.url + imgSize + '?r=' + compoundRevision)
            return
        }
        
        let recentImages = false;
        if(identity && identity.profile && !identity.profile.hasImages){
            if(props.entity.id === identity.profile.id) {
                recentImages = sessionStorage.getItem('hasImages-' + props.profile.id) === 'true'
            }
        }
        
        if(props.entity.hasImages || recentImages || revision){

            const size = props.original ? 'original' : Inline.switch(gridSize,
                '1920x1080', //default
                ['xs', 'sm', ], '600x315',
                ['md', 'lg', ], '1200x630'
            );

            const url = props.entity.getCdnUrl() + '/' + size + '?r=' + compoundRevision;
            setImageUrl(url)
        }

    }, [props.url, entityType, entityId, compoundRevision])

    let img = {};

    const identity = useIdentity()
    if(!props.noUpload && props.entity){
        if(props.entity.isOwnedBy(identity)){
            img.upload = (
                <Mpg.Upload 
                  entity={props.entity}
                  button={<Mpg.Tag as="Button" variant="link" className="absolute" size="sm" bottom={0} right={0}>
                      <Mpg.FontAwesomeIcon icon="upload"></Mpg.FontAwesomeIcon>
                  </Mpg.Tag>}
                  onUpload={()=>{ 
                    setRevision(revision+1) 
                  }} 
                />
            )
        }
    }

    const handleImageError = (e) => {
        setImageError(true)
        e.preventDefault();
    }

    if(imageUrl){
      
        if(component.cover){

            if(imageUrl && !imageError) {
                component.style.backgroundImage = 'url("' + imageUrl + '")'
                component.classes.push('cover-image')
            
                img.element = (
                    <img
                        style={{width: '1px', height: '1px', opacity: 0}}
                        alt="Pixel"
                        src={imageUrl}
                        onError={handleImageError}
                    />
                )
            }

        }
        else{


            if(imageUrl && !imageError) {

                const imgStyle = {
                    width: '100%'
                }
            
                if(component.style.width){
                    imgStyle.width = component.style.width
                    delete component.style.width
                }
                if(component.style.height){
                    imgStyle.height = component.style.height
                    delete component.style.height
                }

                img.element = (
                    <img
                        style={imgStyle}
                        alt="Image"
                        src={imageUrl}
                        onError={handleImageError}
                    />
                )
            }
            
        }

        
    }
    
    
   
    return (

        <Mpg.div 
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            relative>

            {img.element}

            {props.children}

            {img.upload}
        </Mpg.div>
    )
}
    