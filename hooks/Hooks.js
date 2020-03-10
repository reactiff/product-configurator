import {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'

var globalIdentity = null

const isClient = typeof window === 'object'

const getBootstrapGridSize = () => {
    if(!isClient) return undefined
    const breaks = [
        [1200, 'xl'],
        [992, 'lg'],
        [768, 'md'],
        [576, 'sm']
    ]
    for(let x of breaks){
        if(window.innerWidth >= x[0]) 
        {
            return x[1]
        }
        
    }
    return 'xs'
}

const getScrollPosition = () => {
    if(!isClient) return undefined
    return document.body.scrollTop || document.documentElement.scrollTop
}

export const useBootstrapGridSize = () => {

    const [gridSize, setGridSize] = useState(getBootstrapGridSize())

    useEffect(() => {

        if (!isClient) return false
        
        const handleResize = () => {
            setGridSize(getBootstrapGridSize())
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    return gridSize
}

export const useBootstrapGridSizeValue = () => {

    const size = useBootstrapGridSize()

    const map = {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
    }
    
    return map[size]
}

export const useWindowHeight = () => {

    const [height, setHeight] = useState(window.innerHeight)

    useEffect(() => {

        if (!isClient) return false
        
        const handleResize = () => {
            setHeight(window.innerHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)

    }, [])

    return height
}

export const useScrollPosition = () => {

    const [lastKnownScrollPosition, setLastKnownScrollPosition] = useState(0)
    const [ticking, setTicking] = useState(getScrollPosition())
    const [scrollPosition, setScrollPosition] = useState(getScrollPosition())

    useEffect(() => {

        if (!isClient) return false
        
        const handleScroll = function(e) {
            setLastKnownScrollPosition(getScrollPosition());
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    setScrollPosition(lastKnownScrollPosition);
                    setTicking(false);
                });
                setTicking(true);
            }
          }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)

    }, [ticking, lastKnownScrollPosition])

    return scrollPosition
}

var sharedcontext = {}

class StateTupleWrapper {
    constructor(tuple){
        this.tuple = tuple
    }
    get value() { return this.tuple[0] }
    set(value){
        this.tuple[1](value)
    }
}
/**
 * Creates or returns existing shared context object which exposes get() and set() methods.
 * @param {*} name 
 */
export const useSharedContext = function(name) {
    
    const SharedContext = function() {

        let context = this;
        context.dictionary = {}
        
        return new Proxy(context, {

            //used to refer to named tuple i.e. context[name]
            get: function (target, key) {
                return context.dictionary[key];
            },

            //used to assign the named [state, setState] tuple from useState()
            set: function Set(target, key, stateTuple, receiver) {
                if(!context.dictionary[key]){
                    context.dictionary[key] = new StateTupleWrapper(stateTuple)
                }
                return true
            }
        })
            
        
    }

    if(!sharedcontext[name]){
        sharedcontext[name] = new SharedContext()
    }

    return sharedcontext[name]
}

export const setGlobalIdentity = (identity) =>{
    
    globalIdentity = identity
    
}

export const useIdentity = () => {

    // let identityObject = null
    // const identityString = sessionStorage.getItem('sessionIdentity') || localStorage.getItem('sessionIdentity')
    // if(identityString && identityString.length>0){
    //     identityObject = JSON.parse(identityString)    
    // }
    // const defaultIdentityObject = { user: null, roles: {}, profiles: {}, role: 'visitor', profile: null }

    // identityState = useState(identityObject || defaultIdentityObject)

    return globalIdentity
}