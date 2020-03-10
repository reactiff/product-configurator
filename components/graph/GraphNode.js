import React from 'react';
import {useState, useRef} from 'react';

import GraphNodeClass from './classes/GraphNodeClass'
import Draggable from './classes/Draggable'
import DropTarget from './classes/DropTarget'

const GraphNode = props => {

    const [dropTargetEventFlag, setDropTargetEventFlag] = useState(false)
    const [draggableEventFlag, setDraggableEventFlag] = useState(false)

    const [children, setChildren] = useState([]) 

    const [isDropZone, setIsDropZone] = useState(true)
    const [dragging, setDragging] = useState(false)

    const component = useRef(new GraphNodeClass(
        props.name, 
        props.context, 
        props.allowDrop ? new DropTarget(
            { 
                onDragEnter: (event) => {

                    if(props.context.status.dropTargetZIndex > props.zIndex){
                        return 
                    }

                    //console.log('drop target: ' + props.name)

                    props.context.status.dropTargetName = props.name
                    props.context.status.dropTargetZIndex = props.zIndex

                    // props.context.status.time = Date.now()                    
                    
                    // setIsDropZone(true)
                    // setDropTargetEventFlag(flag => !flag) // setEventFlag
                },
                
                onDragLeave: (event) => {
                    //setIsDropZone(false)
                    setDropTargetEventFlag(flag => !flag) // setEventFlag
                },

                onDragOver: (event) => {

                    event.preventDefault()

                    //setDropTargetEventFlag(flag => !flag) // setEventFlag

                },

                onDrop: (event, droppedItem) => {
                    console.log(droppedItem.name)
                    props.context.zIndex++

                    setChildren(children => children.concat([{zIndex: props.context.zIndex, item: droppedItem}]))
                    //component.current.children.push({zIndex: props.context.zIndex, item: droppedItem} )

                    setDropTargetEventFlag(flag => !flag) // setEventFlag
                }
            }
        ) : null,

        props.allowDrag ? new Draggable(
            { 
                onDragStart: (event) => {
                    setDragging(true)
                } ,
                onDragEnd: (event) => { 
                    setDragging(false)
                }
            }
        ) : null
    ))
    
    const classes = ['graph-node'] 
    const other = {}

    other.style = {
        zIndex: props.zIndex 
    }

    if(props.allowDrag){
        classes.push('draggable')
        other.draggable = true
        other.onDragStart = component.current.draggable.handleDragStart
        other.onDragEnd = component.current.draggable.handleDragStart
    }
    
    if(props.allowDrop) {

        classes.push('drop-target')

        other.onDragEnter = component.current.dropTarget.handleDragEnter
        other.onDragLeave = component.current.dropTarget.handleDragLeave
        
        
    } 

    if(props.allowDrop && isDropZone){
        classes.push('active')
        other.onDragOver = component.current.dropTarget.handleDragOver
        other.onDrop = component.current.dropTarget.handleDrop
    }

    return <div className={classes.join(' ')} {...other}>
        {props.name}


        {
          children.map((child, index) => {
            return <GraphNode key={child.item.id} context={props.context} name={child.item.name} allowDrop={true} zIndex={child.zIndex} />
          })
        }

    </div>

}


export default GraphNode