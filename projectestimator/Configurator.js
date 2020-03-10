import React from 'react';
import {ui} from '../gcc';

import SectionTitle from './SectionTitle';
import { fnOrValue } from '../shared/Util';

import KitSelector from './KitSelector';
import KitVariationGroups from './KitVariationGroups';
import KitOptionGroups from './KitOptionGroups';

export default props => {

    const configuration = React.useRef({});
    const config = configuration.current;

    const notifyConfiguration = () => {
        const newConfig = {};
        Object.assign(newConfig, config);
        props.onChange(newConfig);
    };

    const selectKit = (kit) => {
        config.kit = kit;
        for (let key of Object.keys(config.kit.variationGroups)) {
            const group = config.kit.variationGroups[key];
            const items = fnOrValue(group.items);
            config[key] = items[0].value;
        }
        notifyConfiguration();
    }

    const selectVariation = (variationKey, value) => {
        config[variationKey] = value;
        notifyConfiguration();
    }

    const selectOption = (optionKey, value) => {
        config[optionKey] = value;
        notifyConfiguration();
    }

    if(!config.kit && props.kits.length) {
        setTimeout((k) => {
            selectKit(k)
        }, 0, props.kits[0]);
    }

    return <ui.Panel className="kit-selection-panel">
        <SectionTitle>Select Fencing Material</SectionTitle>
        <KitSelector kits={props.kits} configuration={config} onSelect={selectKit} />
        <KitVariationGroups kit={config.kit} configuration={config} onSelect={selectVariation} />
        <KitOptionGroups kit={config.kit} configuration={config} onSelect={selectOption} />
    </ui.Panel>
}





