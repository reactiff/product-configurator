import { StringUtil } from "../../../shared/Util";
import Entity from "../../../shared/Entity";


//import Mpg from '../Mpg'
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

const parseValue = (value) => {

    if(isNumeric(value)){
        return parseFloat(value)
    }
    else{
        return value
    }

}

export const getDirectives = (custom) => {

    const directives = {
        
        as: (value) => ({ custom: { as: value }}),
        
        opacity: (value) => ({ style: { opacity: value }}),

        bgColor: (value) => ({ style: { backgroundColor: value }}),
        border: (value) => ({ style: { border: value }}),
        borderTop: (value) => ({ style: { borderTop: value }}),
        borderLeft: (value) => ({ style: { borderLeft: value }}),
        borderRight: (value) => ({ style: { borderRight: value }}),
        borderBottom: (value) => ({ style: { borderBottom: value }}),
        borderRadius: (value) => ({ style: { borderRadius: value }}),

        className: (value) => ({ class: value }),
        color: (value) => ({ style: { color: value }}),
        
        data: (value) => ({ custom: { data: value }}),

        font: (value) => ({ style: { font: value }}),
        fontFamily: (value) => ({ style: { fontFamily: value }}),
        fontSize: (value) => ({ style: { fontSize: value }}),
        fontWeight: (value) => ({ style: { fontWeight: value }}),

        id: (value) =>  ({ custom: { id: value }}),

        tabIndex: (value) =>  ({ attribute: { tabIndex: value }}),

        style: (value) => value && ({ style: value }),

        transform: (value) => value && ({ style: { transform: value }}),

        // margin
        margin: (value) => ({ style: { margin: parseValue(value) }}),
        marginTop: (value) => ({ style: { marginTop: parseValue(value) }}),
        marginLeft: (value) => ({ style: { marginLeft: parseValue(value) }}),
        marginRight: (value) => ({ style: { marginRight: parseValue(value) }}),
        marginBottom: (value) => ({ style: { marginBottom: parseValue(value) }}),

        //padding
        padding: (value) => ({ style: { padding: parseValue(value) }}),
        paddingTop: (value) => ({ style: { paddingTop: parseValue(value) }}),
        paddingLeft: (value) => ({ style: { paddingLeft: parseValue(value) }}),
        paddingRight: (value) => ({ style: { paddingRight: parseValue(value) }}),
        paddingBottom: (value) => ({ style: { paddingBottom: parseValue(value) }}),
        
        // coordinates
        top: (value) => ({ style: { top: parseValue(value) }}),
        left: (value) => ({ style: { left: parseValue(value) }}),
        right: (value) => ({ style: { right: parseValue(value) }}),
        bottom: (value) => ({ style: { bottom: parseValue(value) }}),
        
        // size
        size: (value) => ({ custom: {size: parseValue(value)}, style: { width: parseValue(value), height: parseValue(value) } }),
        width: (value) => ({ style: { width: parseValue(value) }}),
        height: (value) => ({ style: { height: parseValue(value) }}),
        minWidth: (value) => ({ style: { minWidth: parseValue(value) }}),
        minHeight: (value) => ({ style: { minHeight: parseValue(value) }}),
        
        // FLEX PROPERTIES
        flexBasis: (value) => ({ style: { flexBasis: value }}),
        order: (value) => ({ style: { order: value }}),
        alignSelf: (value) => ({ style: { alignSelf: value }}),
        // grow: (value) => ({ style: { flexGrow: value }}),
        // shrink: (value) => ({ style: { flexShrink: value }}),

        //events
        onClick: (value) => ({ event: { onClick: value }}),
        onDoubleClick: (value) => ({ event: { onDoubleClick: value }}),
        onSelect: (value) => ({ event: { onSelect: value }}),
        onChange: (value) => ({ event: { onChange: value }}),
        

        // S W I T C H E S
        

        solid: (value) => value && ({ class: 'solid' }),
        translucent: (value) => value && ({ class: 'translucent' }),
        opaque: (value) => value && ({ class: 'opaque' }),
        fullWidth: (value) => value && ({ class: 'full-width' }),

        bright: (value) => value && ({ class: 'color-bright' }),
        shaded: (value) => value && ({ class: 'color-shaded' }),

        absolute: (value) => value && ({ class: 'absolute' }),
        fixed: (value) => value && ({ class: 'fixed' }),
        relative: (value) => value && ({ class: 'relative' }),
        
        anchorTop: (value) => value && ({ class: 'anchor-top' }),
        anchorLeft: (value) => value && ({ class: 'anchor-left' }),
        anchorRight: (value) => value && ({ class: 'anchor-right' }),
        anchorBottom: (value) => value && ({ class: 'anchor-bottom' }),        
        
        tight:  (value) => value && ({ class: 'no-margin no-padding' }),
        noPadding: (value) => value && ({ class: 'no-padding' }),
        noMargin: (value) => value && ({ class: 'no-margin' }),
        noOverflow: (value) => value && ({ class: 'no-overflow' }),
        noMobile: (value) => value && ({ class: 'no-mobile' }),
        mobileOnly: (value) => value && ({ class: 'mobile-only' }),


        block: (value) => value && ({ class: 'block' }),
        inline: (value) => value && ({ class: 'inline' }),
        inlineBlock: (value) => value && ({ class: 'inline-block' }),
        invisible: (value) => value && ({ style: { visibility: 'hidden'}}),

        small: () => ({ class: 'small'}),
        smaller: () => ({ class: 'smaller'}),

        tall: (value) => value && ({ class: 'tall' }),
        wide: (value) => value && ({ class: 'wide' }),
        fill: (value) => value && ({ class: 'fill' }),        

        round: (value) => value && ({ class: 'round' }),        
        sticky: (value) => value && ({ class: 'sticky' }),
        overlay: (value) => value && ({ class: 'overlay' }),        

        grow: () => ({ style: { flexGrow: 1 }}),
        shrink: () => ({ style: { flexShrink: 1 }}),
        shrink: () => ({ style: { flexShrink: 1 }}),

        alignCenter: (value) => ({ style: { textAlign: 'center' }}),
        alignLeft: (value) => ({ style: { textAlign: 'left' }}),
        alignRight: (value) => ({ style: { textAlign: 'right' }}),
        align: (value) => ({ style: { textAlign: value }}),
        textAlign: (value) => ({ style: { textAlign: value }}),
        
        center: (value) => value && ({ class: 'center-xy' }),
        centerX: (value) => value && ({ class: 'center-x' }),
        centerY: (value) => value && ({ class: 'center-y' }),
        centerXY: (value) => value && ({ class: 'center-xy' }),




    }
    
    if(custom){
        for(let key in custom){

            let isNew = !directives.hasOwnProperty(key)
            let overrides = custom[key].override

            let assign = isNew || overrides
            
            if(assign){
                if(custom[key].select){
                    directives[key] = (value) => {
                        const t = typeof value
                        if(t!== 'undefined' && t!== 'null'){
                            const parsedValue = parseValue(value)
                            const property = custom[key].select(parsedValue, key.camelToKebabCase())
    
                            if(property.class || property.style){
                                return property
                            }
                            else{
                                return { custom: property }
                            }
                        }
                    } 
                }
                else{
                    directives[key] = (value) => {
                        const t = typeof value
                        if(t!== 'undefined' && t!== 'null'){
                            const property = {}
                            property[key] = value
                            return { custom: property }
                        }
                    } 
                }
            }
            

        }
        
    }
    

    return directives
}

const ignoredProps = {
    identity: true,
    history: true,
    location: true,
    match: true,
    staticContext: true,
    children: true,
    style: true,
    icon: true,
    setDisclosedView: true,
}

export default {

    keyValueStyle: (value, key) => {
        if(value){
            const obj = { style: {} }
            obj.style[key] = value
            return obj
        }
        
    },
    
    keyValueClass: (value, key) => value && ({ class: key + '-' + value.replace(/\s/g, '-') }),
    
    keyClass: (value, key) => value && ({ class: key }),
    valueClass: (value, key) => value && ({ class: value.replace(/\s/g, '-') }),

    parse: ($class, props, customDirectivesMap, suppressTagValidation) => {

        const componentDirectives = getDirectives(customDirectivesMap)
        
        //Throw on missing required props
        for(let key in customDirectivesMap){
            if(customDirectivesMap[key].hasOwnProperty('required')){
                if(!props.hasOwnProperty(key)){
                    throw new Error('Missing ' + key + ' prop of ' + $class);
                }
            }
        }
        
        //check if props contain keys not found in componentDirectives
        if(!suppressTagValidation){
            if(props){
                for(let prop in props) {
                    if(!componentDirectives.hasOwnProperty(prop) && !ignoredProps.hasOwnProperty(prop)){
    
                        throw new Error('Unexpected prop: ' + prop + '="'+props[prop]+'"')                    
                        
                        
                    }
                }
            }
    
        }

        const propDefaults = {}
        let flag

        //Assign default values
        for(let key in customDirectivesMap){
            if(customDirectivesMap[key].hasOwnProperty('default')){
                // if(key==='alignRight'){
                //     flag = 1
                //     debugger
                // }
                if(props[key] === null || typeof props[key] === 'undefined'){
                    propDefaults[key] = customDirectivesMap[key].default
                }
            }
        }

        
        const values = []

        //execute all directives from properties
        if(props){
            for(let dir in componentDirectives) {

                // if(dir==='alignRight' && flag){
                //     debugger
                // }

                let value = props[dir]
                
                if(value === null || typeof value == 'undefined'){
                    value = propDefaults[dir]
                }
                
                const t = typeof value
                if(t!== 'undefined' && t!== 'null'){

                    
                    if(componentDirectives.hasOwnProperty(dir)){

                        const processedValue = componentDirectives[dir](value)

                        if(Object.keys(processedValue).length>1){
                            for(let key in processedValue){
                                const obj = {}
                                obj[key] = processedValue[key]
                                values.push(obj)
                            }    
                        }
                        else{
                            values.push(processedValue)
                        }
                        

                        
                    }
                }
            }
        }

        //extract properties not covered by directives
        const otherProps = {}
        if(props){
            for(let key in props){
                if(!componentDirectives.hasOwnProperty(key)){
                    otherProps[key] = props[key]
                }
            }
        }

        //transfer events not covered by directives
        // if(props){
        //     for(let key in props){
        //         if(!componentDirectives.hasOwnProperty(key)){
        //             otherProps[key] = props[key]
        //         }
        //     }
        // }
        
        const customEvents = {}
        const events = values.filter(x=>x.hasOwnProperty('event')) //.reduce((a,b) => {Object.assign(a, b.event); return a}, {})
        for(let item of events){
            
            const e = item.event

            for(let eventName in e){
                if(!customDirectivesMap.hasOwnProperty(eventName)){
                    otherProps[eventName] = e[eventName]
                }

                customEvents[eventName] = e[eventName]
            }
        }

        const attributes = values.filter(x=>x.hasOwnProperty('attribute')) //.reduce((a,b) => {Object.assign(a, b.event); return a}, {})
        for(let item of attributes){
            
            const a = item.attribute

            for(let attrName in a){
                //if(!customDirectivesMap.hasOwnProperty(eventName)){
                otherProps[attrName] = a[attrName]
                //}
            }
        }
        
        

        // const tag = {}
        // const tagData = values.filter(x=>x.hasOwnProperty('tag'))
        // if(tagData.length){
        //     for(let td of tagData){
        //         Object.assign(tag, td.tag)
        //     }
        // }

        const children = props && props.children

        const data = props && (props.data || children) // data parameter takes precedence, otherwise use children as data

        //let entity = (props && props.entity) || (props && props.data && props.data.entity) 
        
        const result = {
            style: values.filter(x=>x.hasOwnProperty('style')).reduce((a,b) => {Object.assign(a, b.style); return a}, {}),
            classes: values.filter(x=>x.hasOwnProperty('class')).reduce((a,b) => a.concat(b.class.split(' ')), []),
            other: otherProps,
            tag: (values.find(x=>x.hasOwnProperty('tag')) || {}).tag,
            children: children,
            data: data
            //entity: entity
        }

        //assign events from custom directives
        Object.assign(result, customEvents)

        //assign values from custom directives
        const customValues = values.filter(x=>x.hasOwnProperty('custom'))
        if(customValues.length){

            for(let td of customValues){

                if(td.custom.hasOwnProperty('entity')){

                    const keys = Object.keys(td.custom)        
                    if(keys.some(k => result.hasOwnProperty(k))){
                        debugger
                    }

                    if(td.custom.entity && td.custom.entity.entityType){
                        td.custom.entity = Entity.fromItem(td.custom.entity)
                    }
            
                    
                }

                Object.assign(result, td.custom)
            }

        }

        

        return result

    }

} //Directives