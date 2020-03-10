import React from 'react'
import Mpg from './Mpg'
import './css/responsiveheader.css'

const $class = "mpg-responsive-header"
const $description = 'Page header with automatic mobile and desktop layout'
const $params = {
    //title: {type:'string', default: 'Title'},
    height: { type: 'any', default: '55vw'},
    mobileStyle: { type: 'any'},
    desktopStyle: { type: 'any'},
    bgColor: { type: 'any', default: 'transparent' },
    watermark: { type: 'any' },
    watermarkOpacity: { type: 'number', default: 0.1 }
}
const $sampleProps = {  }
export default (props) => {

    //If no props, return metadata
    if(!props){
        return { description: $description, params: $params, class: $class, getSampleData: () => ({props: $sampleProps}) }
    }   

    const component = Mpg.PropsParser.parse($class, props, $params)

    if(!component.watermark){
        component.watermark = <Mpg.FontAwesomeIcon icon="globe" size="10x"/>
    }

    const {height, backgroundColor, ...style} = component.style

    const mobileStyle = {}
    const desktopStyle = {}
    Object.assign(mobileStyle, style)
    Object.assign(desktopStyle, style)
    

    if(component.mobileStyle) {
        Object.assign(mobileStyle, component.mobileStyle)
    }

    if(component.desktopStyle) {
        Object.assign(desktopStyle, component.desktopStyle)
    }
    

    return (


        <>
            {/* MOBILE HEADER */}
            <Mpg.div 
                {...component.other}
                style={mobileStyle}
                className={$class + ' ' + component.classes.join(' ')} 
                relative height={height} fullWidth mobileOnly>

                <Mpg.Flex className="watermark" tight absolute justifyContent="center" alignItems="center" width="100%" height="100%" style={{opacity: component.watermarkOpacity}}>

                    <Mpg.div bgColor={backgroundColor} style={{alignSelf: 'stretch'}} grow>&nbsp;</Mpg.div>  
                    <Mpg.Flex bgColor={backgroundColor} style={{alignSelf: 'stretch'}} alignItems="center" tight>{component.watermark}</Mpg.Flex>
                    <Mpg.div bgColor={backgroundColor} style={{alignSelf: 'stretch'}} grow>&nbsp;</Mpg.div>  

                </Mpg.Flex>
                <Mpg.Flex tight absolute justifyContent="center" alignItems="center" width="100%" height="100%">
                    {component.children}
                </Mpg.Flex>
                
            </Mpg.div>

            {/* DESKTOP HEADER */}
            <Mpg.Flex 
                {...component.other}
                
                style={desktopStyle}
                className={$class + ' ' + component.classes.join(' ')} 
                tight alignItems="center" opaque noMobile padded relative>

                <Mpg.div style={{opacity: component.watermarkOpacity}}>
                    {component.watermark}
                </Mpg.div>
                

                {component.children}

            </Mpg.Flex>
        </>
       
    )
}
    

