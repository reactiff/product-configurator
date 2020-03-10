import React from 'react';
import {ui} from '../../gcc';
import uuid from 'uuid/v4';
import Inline from '../../shared/Inline';
import {useBootstrapGridSize} from '../../hooks/Hooks';


const assemblies = [
    {category:'Fence Panel',material:'vinyl',price:94.99,style:'Modern',imageName:'vinyl.jpg'},
    {category:'Fence Panel',material:'vinyl',price:104.99,style:'Valley',imageName:'panel_style_valley.jpg'},
    {category:'Post Top',material:'vinyl',price:5.99,style:'Plain',imageName:'post_top_plain.jpg'},
    {category:'Post Top',material:'vinyl',price:25.99,style:'Solar',imageName:'post_top_solar.jpg'},
    {category:'Fence Gate',material:'vinyl',price:119.99,style:'Missouri',imageName:'gate_style_missouri.jpg'},
    {category:'Fence Gate',material:'vinyl',price:129.99,style:'Washington',imageName:'gate_style_washington.jpg'},
    {category:'Gate Latch',material:'',price:29.99,style:'Latch',imageName:'latch_style_latch.jpg'},
    {category:'Gate Latch',material:'',price:39.99,style:'Bolt',imageName:'latch_style_bolt.jpg'},
    {category:'Gate Latch',material:'',price:49.99,style:'Heavy Duty',imageName:'latch_style_heavy.jpg'},
];

export default () => {

    const gridSize = useBootstrapGridSize();
    const imageSize = Inline.switch(gridSize, 120, 'xs', 80);

    const projected = assemblies.map(item => {
        item.id = uuid();
        item.value = item.style;
        item.thumbnail = <ui.Tag as="img" src={'/images/'+item.imageName} alt={item.name} width={imageSize} />;
        item.text = <>
            <strong>{item.style}</strong>
            <ui.div shaded>
                <small>${item.price.toFixed(2) + '/ each'}</small>
            </ui.div>
        </>
        return item;
    })

    return projected;

}