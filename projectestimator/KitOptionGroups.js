import React from 'react';
import SectionTitle from './SectionTitle';
import OptionSelector from './OptionSelector';
import { fnOrValue } from '../shared/Util';
import matchFilterParams from './matchFilterParams.js';

import {useBootstrapGridSize} from '../hooks/Hooks';
import Inline from '../shared/Inline';

export default props => {

    const {kit, configuration, onSelect} = props;

    if(!kit) {
        return null;
    }

    const gridSize = useBootstrapGridSize();
    const itemSize = Inline.switch(gridSize, 200, 'xs', 142);

    return Object.keys(kit.optionGroups).map(optionKey => {

        const group = kit.optionGroups[optionKey];
        const unfiltered = fnOrValue(group.items);
        let items;
        
        if(group.filterParams){
            items = unfiltered.filter(x => matchFilterParams(x, group.filterParams));
        }
        else{
            items = unfiltered;
        }
            
        return <React.Fragment key={optionKey}>
            <SectionTitle>{optionKey.camelToSentenceCase()}</SectionTitle>
            <OptionSelector onSelect={(item) => onSelect(optionKey, fnOrValue(item.value))} 
                variant="inline"
                margin={15}
                size={itemSize}
                items={items} 
                isItemSelected={item => {
                    const result = configuration[optionKey] && configuration[optionKey] === fnOrValue(item.value);
                    return result;
                }}
                thumbnailForItem={item => item.thumbnail}
                textForItem={item => item.text}
            />
        </React.Fragment>
    });
}