import React from 'react';
import {ui} from '../gcc';
import OptionSelector from './OptionSelector';

export default props => {

    const {kits, configuration, onSelect} = props;

    return (
        <OptionSelector onSelect={(item) => onSelect(item)} 
            variant="block"
            items={kits} 
            isItemSelected={(item, index) => !configuration.kit ? index === 0 : configuration.kit.id === item.id}
            thumbnailForItem={(item) => <ui.Tag as="img" src={item.imagePath} alt={item.name} width={80} />}
            textForItem={(item) => <>
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                </>
            }
        />
    );
}