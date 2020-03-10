import React from 'react';
import uuid from 'uuid/v4';
import GraphNode from '../GraphNode'

export default class GraphNodeClass {

    constructor(name, context, dropTarget, draggable) {
        
        this.id = uuid()
        this.name = name
        this.context = context
        this.children = []

        if(dropTarget){
            dropTarget.item = this
            dropTarget.context = context
            this.dropTarget = dropTarget
        }

        if(draggable){
            draggable.item = this
            draggable.context = context
            this.draggable = draggable
        }

    }

    endDrag() {
        if(this.draggable){
            this.draggable.endDrag()
        }
    }

    renderChildren() {
        
        if(this.children.length === 0) {
            return null
        }

        const self = this
        return this.children.map((child, index) => {

            return <GraphNode key={index} context={self.context} name={child.item.name} allowDrop={true} zIndex={child.zIndex} />

        })

    }
}