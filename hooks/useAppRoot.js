import {useState, useEffect, useRef} from 'react'

var appRoot = {};

export default (initialized) => {

    if(initialized){
        appRoot = initialized;
    }

    return appRoot;    
}

    
