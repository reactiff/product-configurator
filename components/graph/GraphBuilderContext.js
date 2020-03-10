export default class GraphBuilderContext {

    constructor(options) {

        this.options = options
        this.dragItem = null
        
        this.zIndex = 1000

        this.status = {

            
        }
    }

    notifyEvent() {
        if(this.options.onEvent){
            this.options.onEvent()
        }
    }



    setDragItem(item){
        this.dragItem = item
        this.notifyEvent()
    }
  
    


}