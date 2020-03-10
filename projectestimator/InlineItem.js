import React from 'react';
import gcc, {ui} from '../gcc';
import './css/InlineItem.css';

export default props => {

    const margin = props.margin || 15;
    const itemStyle = props.selected ? {
            border: "2px solid #ef7129",
            padding: 1,
        } : {
            border: "2px solid #eee",
            padding: 1,
        };

    return <button className="inline transparent InlineItem" style={{ marginRight: margin, marginBottom: margin }} onClick={()=>props.onClick()}>
        <ui.Flex column size={props.size} justifyContent="center" alignItems="center" textAlign="center" tight padding={1} style={itemStyle}>
            {props.children}
        </ui.Flex>
    </button>
}