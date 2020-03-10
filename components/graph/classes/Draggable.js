export default class Draggable {

    constructor(options) {

        this.item = null
        this.context = null
        this.isDragging = false
        this.options = options

    }
    
    handleDragStart = (e) => {

        this.isDragging = true
        this.context.dragItem = this.item

        this.options.onDragStart && this.options.onDragStart(e)

    }
  
    endDrag = (e) => {

        this.isDragging = false
        this.context.dragItem = null

        this.options.onDragEnd && this.options.onDragEnd(e)
    }

}