import React from 'react'
import gcc, {ui} from '../../gcc';
import GraphNode from './GraphNode'


function menuItemsFromArray(items, props) {

    return (
        <div>
            {
                items.map((item, index) => <GraphNode 
                    key={index} 
                    context={props.context}
                    name={item}
                    allowDrag={true}
                    allowDrop={false}
                />)
            }
        </div>
    );
}


export default props => {

    const kits = ['Railing', 'Fencing', 'Drywall'];
    const assemblies = ['', 'Fencing', 'Drywall'];
    const products = ['Railing', 'Fencing', 'Drywall'];

    const data = {
        kits: menuItemsFromArray(kits, props),
        assemblies: menuItemsFromArray(assemblies, props),
        products: menuItemsFromArray(products, props),
    };

    return (
        <div className="flex column menu">
            <ui.Accordion data={data} />
        </div>
        
    );
   
    

}