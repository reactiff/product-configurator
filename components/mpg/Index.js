import React from 'react'
import { useState, useEffect } from 'react'

import Mpg from './Mpg'
import Metadata from './modules/Metadata'

import { fnOrValue } from '../../shared/Util'
import {getDirectives} from './modules/PropsParser'

// LIST OF ALL MPG COMPONENTS
export default (props) => {

    const [componentId] = useState(props.match.params.componentId)

    // const [keys, setKeys] = useState(null)
    const [header, setHeader] = useState(null)
    // const [aside, setAside] = useState(null)
    const [main, setMain] = useState(null)

    const [retryCount, setRetryCount] = useState(0)

    //const [portalContainer, setPortalContainer] = useState(null)

    const standardDirectives = Object.keys(getDirectives())
    standardDirectives.sort((a,b) => a-b)

    const ignoreKeys = [
        'DemoContainer',
        'Index',
        'LoremIpsum',
        'MapReduce',
        'MasonryItem',
        'PropsParser',
        'PortalInspector',
        'Inline',
        'FontAwesomeIcon',
        'ErrorBoundary',
        'BackToTopButton',
        'DataTable',
        'FlexCol',
        'EntityLink',
        'PeriodSelector'
    ]

    const keys = Object.keys(Mpg).filter(key => !ignoreKeys.includes(key))
    keys.sort((a,b)=>a-b)
    
    const aside = (
        <>
            <Mpg.Panel>
                <div id="portalContainer" className="demo">
                    <span className="identifier">#portalContainer</span>
                </div>
            </Mpg.Panel>

            <Mpg.Panel>
                
                <h2>Component Index</h2>

                <Mpg.Tag as="ul" className="plain">
                    {
                        keys.map((key, index) => {
    
                            let hasError = false
                            let notImplemented = false
                            
                            //try to render each component
                            try 
                            {
                                const test = Mpg[key]()
                                if(!test.hasOwnProperty('description') || test.description.length === 0){
                                    notImplemented = true
                                }
    
                            }
                            catch
                            {
                                hasError = true
                            }
    
                            const style = {}
                            
                            if(hasError){
                                style.color = 'red'
                                style.fontWeight = 'bold'
                            } else if(notImplemented){
                                style.color = 'red'
                            }
                            
    
    
                            return (
                                <li key={index}>
                                    {/* <Button className="no-padding" variant="link" onClick={() => {setComponentId(key)}}>{key}</Button> */}
                                    <a style={style} href={"/mpg/"+key}>{key}</a>
                                </li>
                            )
                        })
                    }
                </Mpg.Tag>
            </Mpg.Panel>

            <Mpg.Panel>
                <h2>Standard Tag Directives</h2>
                <Mpg.Tag as="ul" className="plain">
                    {
                        standardDirectives.map((key,i) => (
                            <li key={i}>
                                {key}
                            </li>
                        ))
                    }
                </Mpg.Tag>
            </Mpg.Panel>
        </>
    )

    // setAside(aside) // 2



    useEffect(() =>{

        const c = Mpg[componentId]
        let main = null
        let header = <h1>MPG components</h1>
    
        if(c){
    
            header = <h1>{componentId}</h1>
    
            const metadata = c() //call component without props to get metadata

            const tabs = {}

            if(metadata.getSampleData || metadata.examples) {

                if(metadata.examples){

                    //multiple examples
                    for(let key in metadata.examples){

                        const sampleData = fnOrValue(metadata.examples[key])
                        const sampleProps = sampleData['props'] ? sampleData['props'] : { data: sampleData }

                        tabs[key] = () => <Mpg.Panel className="minimal" bgColor="rgba(0,0,0,0.1)">{c(sampleProps)}</Mpg.Panel>
                    }

                }
                else{
                    const sampleData = metadata.getSampleData()

                    if(Array.isArray(sampleData)){

                        const content = []

                        for(let item of sampleData){
                            if(React.isValidElement(item)){
                                content.push(item)
                            }
                            else{
                                const sampleProps = item['props'] ? item['props'] : { data: item }
                                content.push(c(sampleProps))
                            }
                        }

                    tabs.example = () => <Mpg.Panel className="minimal" bgColor="rgba(0,0,0,0.1)">{content}</Mpg.Panel>
                    }
                    else{
                        const sampleProps = sampleData['props'] ? sampleData['props'] : { data: sampleData }
                        tabs.example = () => <Mpg.Panel className="minimal" bgColor="rgba(0,0,0,0.1)">{c(sampleProps)}</Mpg.Panel>
                    }
                    

                }
            }
            
            main = (
                <>
                    <Metadata name={componentId} data={metadata}></Metadata>
                    <Mpg.Tabs>
                        {tabs}
                    </Mpg.Tabs>
                </>
            )
        }
    
        setHeader(header) // 3
        setMain(main) // 4

        const portcnt = document.getElementById("portalContainer")
        if(!portcnt) {
            setRetryCount(retryCount + 1)
            return
        }

    }, [componentId, retryCount])

    return (
      <Mpg.ProfileLayout
        theme={props.theme}
        setTheme={props.setTheme}
        header={<Mpg.Panel>{header}</Mpg.Panel>}
        aside={aside}
        main={main}
      />
    )

    
}
    