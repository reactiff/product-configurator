import React from 'react'
import {useState} from 'react'
import './css/masonry.css'

import Mpg from './Mpg'

const $class = "masonry-item"
const $description = ''
const $params = [] 

export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class
        }
    }   

    const component = Mpg.PropsParser.parse($class, props, $params)
        
    const style = {}

    if(component.data.colSpan){
        style.gridColumnEnd = 'span ' + component.data.colSpan
    }

    Object.assign(style, component.style)
    
    let content = null;

    if(props.children ){
        content = props.children;
    }
    else{
        const coverStyle = { backgroundImage: 'url("' + component.data.cover + '")'}
        content = <>
            {
                component.data.cover && (
                    <div className="cover-image" style={coverStyle}/>
                )
            }
        
            <div className="title">
                {component.data.title}
            </div>

            <div className="desc">
                {component.data.description}
            </div>
        </>;
    }

    
    return (
        <div 
            {...component.other}
            style={style}
            className={$class + ' ' + component.classes.join(' ')}     
            onClick={() => component.data.onClick && component.data.onClick()}
            >
            <div className="content">
                {content}
            </div>
        </div>
    )    

    
}
