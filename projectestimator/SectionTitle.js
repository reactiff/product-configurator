import React from 'react';
import {ui} from '../gcc';

export default props => {
    return <ui.Flex noPadding> 
            <ui.div borderBottom="1px solid rgb(239, 113, 39)" padding="0 2px">
                <strong>{props.children}</strong>
            </ui.div>
            <ui.div grow borderBottom="1px solid rgba(128,128,128, 0.2)" />
    </ui.Flex>
}