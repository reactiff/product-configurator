import React from 'react';
import {useRef} from 'react';
import './css/graphbuilder.css';

import Graph from './Graph';
import GraphBuilderMenu from './GraphBuilderMenu';
import GraphBuilderContext from './GraphBuilderContext';

export default props => {

    const context = useRef(new GraphBuilderContext());

    return <div className="graph-builder editor fill flex">
        <div className="flex row align self stretch wide">
            <Graph context={context.current} />
            <GraphBuilderMenu context={context.current}/>
        </div>
    </div>
}
