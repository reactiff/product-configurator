import React from 'react';
import gcc, {ui} from '../gcc';

import SectionTitle from './SectionTitle';

export default props => {

    const model = React.useRef({});
    
    Object.keys(props.modelType.fields).map(key => {
        const field = props.modelType.fields[key];
        model.current[key] = field.defaultValue;
    })

    const handleChange = () => props.onChange(model.current);

    return <ui.Panel className="measurements-entry-panel">
        <SectionTitle>Enter Measurements</SectionTitle>

        <ui.Form type={props.modelType} model={model.current} onChange={handleChange} />


        {/* {
            Object.keys(props.modelType.fields).map(key => {

                const field = props.modelType.fields[key];

                return (
                    <ui.Disclosure key={key} caption={key.camelToSentenceCase()} header={key.camelToSentenceCase()} bgColor="#f5f5f5">
                        
                        <div>
                            {
                                field.options.map(value => {
                                    return <button key={value}>{value}</button>
                                })
                            }
                        </div>
                    </ui.Disclosure>
                );
            })
        } */}
    </ui.Panel> 
}