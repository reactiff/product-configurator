import React from 'react';
import gcc, {ui} from '../gcc';

export default props => {

    const border = props.selected ? "2px solid #ef7129" : "2px solid #ddd";

    return <button className="block transparent" onClick={()=>props.onClick()}>
        <ui.Flex row alignItems="center" border={border}>
            {props.children}
        </ui.Flex>
    </button>
}