import React from 'react'
import {fnOrValue} from '../../shared/Util'

import './css/profilelayout.css'

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import Mpg from './Mpg'
import Button from 'react-bootstrap/Button'

const $class = "mpg-layout"
const $description = 'A common page layout, with Header, Main and Side panels'
const $params = {
    header: { type: 'any', description: 'Header content, can be a function' },
    main: { type: 'any', description: 'Main content, can be a function' },
    aside: { type: 'any', description: 'Side panel content, can be a function' },
}
export default (props) => {

    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class ,

            getSampleData: () => {

                return {

                    props: {
                        header: () => <h1>Header</h1>,

                        main: () => {
                            return (
                                <>
                                    <h2>Main</h2>
                                    <p>{Mpg.LoremIpsum.generateWords(50)}</p>
                                </>
                            )
                        },
                        aside: () => { 
                            return (
                                <>
                                    <h3>Aside</h3>
                                    <ul>
                                        {Mpg.LoremIpsum.generateWords(10).split(' ').map((x, i)=><li key={i}>{x}</li>)}
                                    </ul>
                                </>
                            )
                        }
                    }
                }
            }
        }
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)
  

    return (
        <article 
            
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')}    
        
            >
            <div className="container-fluid">

                <Row>
                
                    <Col>
                        <div className="title-section">
                            {fnOrValue(component.header)}
                        </div>
                    </Col>
                
                </Row>

                <Row>
                
                    {/* className="full-width-mobile" */}

                    <Col xs="12" md="8" className=""> 
                        <div className="content-section">
                            {fnOrValue(component.main)}
                        </div>
                    </Col>
                    
                    <Col id="sidebarSection" xs="12" md="4" className="sidebar-section">

                        <div className="sidebar-item">
                            {fnOrValue(component.aside)}
                        </div>
                
                    </Col>
                </Row>

            </div>

            {
                false &&
                !component.suppressFooter &&
                <div className="layout-footer">

                    <div className="container">

                        <Row>
                            <Col xs="12" sm="6" className="footer-panel logo">

                                <div className="footer-logo">
                                    <img src="/logo512.png" alt="Royal Stage Footer Logo"></img>
                                </div>
                            </Col>
                            <Col xs="12" sm="6" className="footer-panel links">
                                <h3>Links</h3>
                                <ul>
                                    {Mpg.LoremIpsum.generateWords(6).split(' ').map((x,i)=><li key={i}><Button variant="link">{x.toProperCase()}</Button></li>)}
                                </ul>

                                <br></br>
                            
                                <Mpg.Dropdown
                                    variant="outline-light"
                                    title="Theme"
                                    value={props.theme}
                                    options={['',{value: 'dark', text: 'Dark'}]}
                                    onChange={(value) => { 
                                        // toggleExpanded(false)
                                        props.setTheme(value) 
                                    }}
                                />
                                

                            </Col>
                            
                        </Row> 
                    </div>
                    
                </div>
            }
            
            
            
        </article>
    )
  
}
  
  