import React, {useEffect, useState} from 'react';
import {ui}  from './gcc';

import Measurements from './projectestimator/Measurements';
import Configurator from './projectestimator/Configurator';
import MaterialList from './projectestimator/MaterialList';
import ConfigurationSummary from './projectestimator/ConfigurationSummary';

export default props => {
        
    const [kits, setKits] = useState([]);
    const [measurements, setMeasurements] = useState({});
    const [configuration, setConfiguration] = useState({});

    useEffect(() => {
        props.getKits()
            .then(response => {
                if(response.ok) {
                    setKits(response.data)
                }
            })
    }, []);
    
    const materialList = props.calculate({ measurements, configuration });

    return <>
        
        <Measurements modelType={props.getMeasurementsModelType()} onChange={ (m) => { setMeasurements(m) } }/>
        <Configurator kits={kits} onChange={ (c) => setConfiguration(c) }/>

        <ui.Portal id="materialList" targetContainer="sidePanel">
            
            <ConfigurationSummary configuration={configuration} />
            {/* <MaterialList data={materialList} /> */}
            
        </ui.Portal>

    </>
}
