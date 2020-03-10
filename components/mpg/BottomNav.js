import React, {useState} from 'react'

import useAppRoot from '../../hooks/useAppRoot'
import {Nav, Button} from 'react-bootstrap'

import Mpg from './Mpg'

import './css/bottomnav.css'
import { useHistory, useLocation } from 'react-router-dom'

const $class = "mpg-bottom-nav mobile-only"
const $description = 'Mobile only fixed toolbar at the bottom'
const $params = {
    routes: { type: 'any' },
    setFlowHidden: { type: 'function' },
    setIdentity: {type: 'function'},
}
export default React.forwardRef((props, ref) => {

    const appRoot = useAppRoot();
    const history = useHistory();
    const location = useLocation();
    const { match, staticContext, ...rest } = props;

    const [menuExpanded, setMenuExpanded] = useState(false);

    //If no props, return metadata
    if(!props){
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: null
        }
    }   

    const component = Mpg.PropsParser.parse($class, rest, $params);

    if(appRoot){
        appRoot.menu = { 
            expanded: menuExpanded,    
            close: () => { setMenuExpanded(false); }
        };
    }

    const navigate = (url) => {
        history.push(url);
    }

    const handleNavigate = (routePath) => {

        if(routePath === '/portal/menu') {
            setMenuExpanded(x => !x);
        }
        else{
            if(appRoot){
                if(appRoot.disclosedView){
                    appRoot.disclosedView.close();
                }
                if(appRoot.isFlowHidden()){
                    appRoot.setFlowHidden(false);
                }
            }
            navigate(routePath);
        }
        
    }

    let menuRoute;
    for(let key of Object.keys(component.routes)) {
        if(component.routes[key].isMenu){
            menuRoute = component.routes[key];
        }
    }
    
    

    return <>
        
        <Nav 
            ref={ref}
            {...component.other}
            style={component.style}
            className={$class + ' ' + component.classes.join(' ')} 
            variant="pills"
        >
            {
                Object.keys(component.routes).map(key => {

                    const route = component.routes[key]
                    const classes = []

                    if(route.exact){
                        if(location.pathname.trim().toLowerCase() === route.path){
                            classes.push('active')
                         }
                    }
                    else{
                        if(location.pathname.trim().toLowerCase().indexOf(route.path) === 0 ){
                            classes.push('active')
                         }
                    }
                    
                    return <Nav.Item key={key} width="20%">
                        <Nav.Link onClick={() => handleNavigate(route.path)} className={classes.join(' ')}>

                            {
                                !route.isMenu &&
                                <Mpg.Flex column tight>
                                    <Mpg.div>
                                        <Mpg.FontAwesomeIcon icon={route.icon} size="2x"/>
                                    </Mpg.div>
                                    <Mpg.div>
                                        <small>{key.toUpperCase()}</small>
                                    </Mpg.div>
                                </Mpg.Flex>
                            }

                            {
                                route.isMenu &&
                                <Mpg.div className={"hamburger hamburger--spin " + (menuExpanded ? "is-active" : "")}>
                                    <span className="hamburger-box">
                                        <span className="hamburger-inner"></span>
                                    </span>
                                </Mpg.div>
                            }
                            
                        </Nav.Link>
                    </Nav.Item>
                })
            }
        </Nav>

        {
            menuExpanded &&
            menuRoute && 
            <Mpg.div className="mpg-bottom-nav-menu">
                <Mpg.Lazy 
                    module={'student/StudentMenu'} 
                    setIdentity={props.setIdentity}
                />
            </Mpg.div>
        }
        
    </>
})
    
