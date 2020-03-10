import React from 'react'
import {useState, useRef} from 'react'

import GraphNode from './GraphNode'
import GraphNodeClass from './classes/GraphNodeClass'
import DropTarget from './classes/DropTarget'


export default props => {

  const divRef = useRef()

  const [dropTargetEventFlag, setDropTargetEventFlag] = useState(false)
  const [isDropZone, setIsDropZone] = useState(true)

  const [children, setChildren] = useState([]) 

  const zIndex = 1000

  const component = useRef(new GraphNodeClass(
    'graph', 
    props.context, 
    new DropTarget(
        { 
          onDragEnter: (event) => {

            if(props.context.status.dropTargetZIndex> zIndex){
              return 
            }

            console.log('drop target: ' + 'graph')

            //setIsDropZone(true)
            //setDropTargetEventFlag(flag => !flag) // setEventFlag
          },
          
          onDragLeave: (event) => {
            //setIsDropZone(false)
            //setDropTargetEventFlag(flag => !flag) // setEventFlag
          },

          onDragOver: (event) => {

            event.preventDefault();

            //setDropTargetEventFlag(flag => !flag) // setEventFlag
          },

          onDrop: (event, droppedItem) => {
            
            if(!droppedItem){
              return 
            }

            props.context.zIndex++

            setChildren(children => children.concat([{zIndex: props.context.zIndex, item: droppedItem}]))
            
            setDropTargetEventFlag(flag => !flag) // setEventFlag

          }
        }
    )
  ))

  const classes = ['graph relative', 'flex', 'column', 'grow', 'canvas', 'drop-target']

  if(isDropZone){
    classes.push('active')
  }
  
  const other = {}

  if(isDropZone){
    other.onDragOver = component.current.dropTarget.handleDragOver
    other.onDrop = component.current.dropTarget.handleDrop
  }

  return <div 
      ref={divRef} 
      className={classes.join(' ')}  
      onDragEnter={component.current.dropTarget.handleDragEnter}
      onDragLeave={component.current.dropTarget.handleDragLeave}
      {...other}
      >

        {
          children.map((child, index) => {
            return <GraphNode key={child.item.id} context={props.context} name={child.item.name} allowDrop={true} zIndex={child.zIndex} />

            //return <Lazy module='AudioNode' key={child.item.id} context={props.context} name={child.item.name} allowDrop={true} zIndex={child.zIndex} />
          })
        }

        <div className="status-bar absolute anchor-bottom wide borderBox" style={{border: 'none', backgroundColor: 'black'}}>
          {
            Object.keys(props.context.status).map((key, index) => {
              return <div key={index} className="status-entry">{key}: {props.context.status[key]}</div>
            })
          }
        </div>

  </div>

}