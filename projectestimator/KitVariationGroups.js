import React from 'react';
import SectionTitle from './SectionTitle';
import OptionSelector from './OptionSelector';
import { fnOrValue } from '../shared/Util';

export default props => {

    const {kit, configuration, onSelect} = props;

    if(!kit) {
        return null;
    }

    return Object.keys(kit.variationGroups).map(variationKey => {

        const groupItems = fnOrValue(kit.variationGroups[variationKey].items);

        return <React.Fragment key={variationKey}>
            <SectionTitle>{variationKey.camelToSentenceCase()}</SectionTitle>
            <OptionSelector onSelect={(item) => onSelect(variationKey, fnOrValue(item.value))} 
                variant="inline"
                margin={5}
                items={groupItems} 
                isItemSelected={item => {
                    const result = configuration[variationKey] && configuration[variationKey] === fnOrValue(item.value);
                    return result;
                }}
                thumbnailForItem={item => item.thumbnail}
                textForItem={item => item.text}
            />
        </React.Fragment>

    });
    
}