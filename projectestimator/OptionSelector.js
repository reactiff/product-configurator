import React from 'react';
import {ui} from '../gcc';

import BlockItem from './BlockItem';
import InlineItem from './InlineItem';

export default props => {

    const Element = props.variant === 'block' ? BlockItem : InlineItem;

    return props.items.map((item, index) => {

        const thumbnail = props.thumbnailForItem && props.thumbnailForItem(item, index);
        const text = props.textForItem && props.textForItem(item, index);
        const selected = props.isItemSelected(item, index);

        return <Element key={index} onClick={() => props.onSelect(item)} selected={selected} size={props.size} margin={props.margin}>
            {thumbnail}
            {
                text &&
                <ui.Flex column grow justifyContent="center" noMargin>
                    {text}
                </ui.Flex>
            }
        </Element>
    })
}