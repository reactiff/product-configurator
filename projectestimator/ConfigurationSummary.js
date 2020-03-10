import React from 'react';
import gcc, {ui} from '../gcc';

import SectionTitle from './SectionTitle';
import OptionSelector from './OptionSelector';
import { fnOrValue } from '../shared/Util';

export default props => {

    const { configuration } = props;
    const {kit, ...summary} = configuration;

    return <ui.Panel>
                    
        <h4>Selected Configuration</h4>

        <hr></hr>

        <ui.Flex row padded tight>
            <ui.div width={200}>
                <strong>Material:</strong> 
            </ui.div>
            <span>{configuration.kit && configuration.kit.name}</span>
        </ui.Flex>

        {
            summary && 
            Object.keys(summary).map(key => {
                return <ui.Flex key={key} row padded tight>
                    <ui.div width={200}>
                        <strong>{key.camelToSentenceCase()}:</strong> 
                    </ui.div>
                    <span>{summary[key]}</span>
                </ui.Flex>
            })
        }
    </ui.Panel>
}



