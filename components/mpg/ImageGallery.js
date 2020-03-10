import React from 'react';
import { Inline } from '../../shared/Util';
import Lightbox from 'react-lightbox-component';

import { useState, useEffect } from 'react'

import { useBootstrapGridSize } from '../../hooks/Hooks'

import Mpg from './Mpg'
import DisclosureView from './DisclosureView';
//import './css/_template.css'

const $class = "mpg-image-gallery"
const $description = 'Image gallery'
const $params = {
    entities: { type: 'array', description: 'An array of Entities for which to display associated images' },
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

    const component = Mpg.PropsParser.parse($class, props, $params);

    // const gridSize = useBootstrapGridSize();

    // let images = [];

    // if(props.images){
    //     images = props.images.map(src => ({
    //         src: src
    //     }))
    // }
    // else if (props.entities) {
    //     images = props.entities.map((entity) => {
    //         return {
    //             src: entity.getCdnUrl() + '/' +
    //                 Inline.switch(gridSize,
    //                     '1920x1080', //default
    //                     ['xs', 'sm', ], '600x315',
    //                     ['md', 'lg', ], '1200x630'
    //                 ) 
    //         }
    //     })
    // }
    // else{
    //     throw new Error('Both images and entities props are missing.  Please provide one of them.');
    // }

    const [disclosureViewOpen, setDisclosureViewOpen] = useState(false)
    const [disclosureViewHeader, setDisclosureViewHeader] = useState(null)
    const [disclosureViewBody, setDisclosureViewBody] = useState(null)

    const handleOpenView = (photo) => {
        setDisclosureViewBody(<Mpg.Image entity={photo} original noUpload style={{margin: '-15px -15px 0 -15px'}} />)
        setDisclosureViewOpen(true)
    }
    const handleImageClick = (photo) => {
        handleOpenView(photo);
    }
    const handleViewClosed = () => {
        setDisclosureViewOpen(false)
        setDisclosureViewBody(null)
    }


    return <>

        <Mpg.Flex wrap="wrap" solid fullWidth tight>
        {
            props.entities.map((photo, index) => {

                return <Mpg.Image key={photo.id} original noUpload solid relative
                    entity={photo} 
                    // width="calc(20vw - 2px)" 
                    // height="calc(20vw - 2px)" 
                    margin="0 0px 1px 0"
                >
                    <button className="block transparent fill" onClick={()=>handleImageClick(photo)}></button>
                </Mpg.Image>

                

            })
        }
        </Mpg.Flex>
        
        {
            disclosureViewOpen && 
            <DisclosureView
                header={disclosureViewHeader}
                onClose={handleViewClosed}
                >

                {disclosureViewBody}

                

            </DisclosureView>
        }

    </>
    
}
    
