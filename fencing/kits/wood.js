import React from 'react';
import uuid from 'uuid/v4';
import { ui } from '../../gcc';

import getAssemblies from './getAssemblies';

export default {

    id: uuid(),
    name: 'Wood',
    description: 'Starting at $85/panel',
    imagePath: '/images/wood.jpg',

    variationGroups: {
        color: {
            items: [ 
                { value: 'pine', thumbnail: <ui.div bgColor="#ddcc00" size={40} /> }, 
                { value: 'cedar', thumbnail: <ui.div bgColor="orange" size={40} /> }, 
            ],
        },
    },

    optionGroups: {

        panelStyle: { 
            required: true, 
            items: getAssemblies,
            filterParams: {
                category: 'fence panel',
                material: 'wood',

            },
            attribute: 'style',
        },

        postTopStyle: { 
            required: false, 
            items: getAssemblies,
            filterParams: {
                category: 'post top',
                material: 'wood',
            },
            attribute: 'style',
        },

        gateStyle: { 
            required: false, 
            items: getAssemblies,
            filterParams: {
                category: 'fance gate',
                material: 'wood',
            },
            attribute: 'style',
        },

        gateLatchStyle: {
            required: true,
            dependencies: ['gateStyle'],
            items: getAssemblies,
            filterParams: {
                category: 'gate latch',
            },
            attribute: 'style',
        },

    },

}