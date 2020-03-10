import React, {useEffect, useState} from 'react';
import {ui} from './gcc';
import ProjectEstimator from './ProjectEstimator';
import getKits from './fencing/getKits';
import getMeasurementsModelType from './fencing/getMeasurementsModelType';
import calculate from './fencing/calculate';

export default props => {
    
    const options = {
        getKits,
        getMeasurementsModelType,
        calculate,
        selectedStore: props.state.selectedStore,
    };

    return <ui.div paddingTop={30}>
        <h2>Build Your Fence</h2>
        <br />
        <ProjectEstimator {...options} />
    </ui.div>;
}
