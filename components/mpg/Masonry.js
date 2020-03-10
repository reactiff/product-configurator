import React from 'react'

import {useEffect} from 'react'

import MasonryItem from './MasonryItem'
import './css/masonry.css'

import Mpg from './Mpg'
import Entity from '../../shared/Entity'
import Config from '../../shared/Config'

const $class = "masonry-grid grid"
const $description = 'Responsive masonry grid'
const $params = {
    min: { type: 'cssunits', description: 'min value for the grid minmax(min, max) function. Default 150px' },
    max: { type: 'cssunits', description: 'max value for the grid minmax(min, max) function. Default 1fr' }
}

export default (props) => {

    if(!props){
        //#region METADATA
        const classList = [];
        return {
            description: $description,
            params: $params,
            class: $class,
            getSampleData: () => {

                return classList.map(c => {
                    
                    const entity = new Entity('class', c)

                    return ({

                        cover: Config.url.cdn + 
                                '/entity/' + 
                                entity.type + '/' + 
                                entity.item.id + '/' +
                                '600x315',

                        cover2: Config.url.cdn + 
                                '/entity/' + 
                                entity.type + '/' + 
                                entity.item.partitionKey + '/' + 
                                entity.item.id + '/' +
                                '600x315',

                        title: c.name,
                        description: c.description,
                        onClick: () => { alert(c.name) }
                    })

                })

            }
        }
        //#endregion
    }   
    
    const component = Mpg.PropsParser.parse($class, props, $params)

    useEffect(()=>{
        const resizeGridItem = (item) => {
            const grid = document.getElementsByClassName("masonry-grid")[0];
            const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
            const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
            const rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height + rowGap)/(rowHeight + rowGap));
            item.style.gridRowEnd = "span " + rowSpan;
        }
        const resizeAllGridItems = () => {
            const allItems = document.getElementsByClassName("masonry-item");
            for(let x=0; x<allItems.length; x++){
                resizeGridItem(allItems[x]);
            }
        }
        setTimeout(resizeAllGridItems, 100)
        window.addEventListener("resize", resizeAllGridItems);
        return () => {
            //unmount
            window.removeEventListener("resize", resizeAllGridItems);
        }
    }, [])
    
    const style = {}

    const minval = component.min || '150px'
    const maxval = component.max || '1fr'

    style.gridTemplateColumns = `repeat(auto-fill, minmax(${minval},${maxval}))`;

    Object.assign(style, component.style)

    const childredAsContent = props.children && Array.isArray(props.children);

    return (
        <div 
            {...component.other}
            style={style}
            className={$class + ' ' + component.classes.join(' ')}
        >
            {
                childredAsContent &&
                props.children
            }
            {
                !childredAsContent &&
                component.data.map((item, i) => { 
                    return <MasonryItem key={i} data={item} />
                })
            }
        </div>
    )

}

  