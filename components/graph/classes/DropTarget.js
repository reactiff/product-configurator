export default class DropTarget {

    constructor(options) {

        this.item = null
        this.context = null
        this.isActive = false
        this.children = []
        this.options = options

    }

    handleDragOver = (e) => {

        

        this.options.onDragOver && this.options.onDragOver(e)

        

    }
        
    handleDragEnter = (e) => {
        
        this.options.onDragEnter && this.options.onDragEnter(e)
        
        e.preventDefault();
    }

    handleDragLeave = (e) => {
        
        e.preventDefault();
        
        this.isActive = false

        this.options.onDragLeave && this.options.onDragLeave(e)
    }
        
    handleDrop = (e) => {
        
        e.preventDefault();

        const droppedItem = this.context.dragItem

        if(!droppedItem){
            return
        }
        
        this.options.onDrop && this.options.onDrop(e, droppedItem)
        
        if(droppedItem){
            droppedItem.endDrag()
        }
        
        
        this.isActive = false
        
    }
    


}