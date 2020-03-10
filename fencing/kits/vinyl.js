import React from 'react';
import uuid from 'uuid/v4';
import { ui } from '../../gcc';

import getAssemblies from './getAssemblies';

export default {

    id: uuid(),
    name: 'Vinyl',
    description: 'Starting at $95/panel',
    imagePath: '/images/vinyl.jpg',

    variationGroups: {
        color: {
            items: [ 
                { value: 'white', thumbnail: <ui.div bgColor="#eeeeee" size={40} /> }, 
                { value: 'beige', thumbnail: <ui.div bgColor="#c7c7b0" size={40} /> }, 
                { value: 'taupe', thumbnail: <ui.div bgColor="#ce8d4f" size={40} /> }, 
            ]
        },
    },

    optionGroups: {

        panelStyle: { 
            required: true, 
            items: getAssemblies,
            filterParams: {
                category: 'Fence Panel',
                material: 'vinyl',
            },
            attribute: 'style',
        },

        postTopStyle: { 
            required: false, 
            items: getAssemblies,
            filterParams: {
                category: 'Post Top',
                material: 'vinyl',
            },
            attribute: 'style',
        },

        gateStyle: { 
            required: false, 
            items: getAssemblies,
            filterParams: {
                category: 'Fence Gate',
                material: 'vinyl',
            },
            attribute: 'style',
        },

        gateLatchStyle: {
            required: false,
            dependencies: ['gateStyle'],
            items: getAssemblies,
            filterParams: {
                category: 'Gate Latch',
            },
            attribute: 'style',
        },

    },

}