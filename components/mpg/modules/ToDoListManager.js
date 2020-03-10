import LocalStorageDictionary from './LocalStorageDictionary'
import uuid from 'uuid/v4'
import StringExt from '../../../shared/StringExt';

class ToDoListManager extends LocalStorageDictionary {
    
    path = null

    constructor(path) {
        super('todo-list');

        this.path = path

    }

    parseNew(path, text, tags) {
    
        const item = {}
    
        item.id = uuid()
        item.path = path || this.path

        item.text = text
        item.complete = 0
        item.priority = 0
        item.tags = {}

        if(tags && tags.trim().length){
            const arr = tags.trim().toLowerCase().split(' ').map(item=>item.trim()).filter(item=>item.length>0)
            for(let tag of arr){
                item.tags[tag] = true
            }
        }
   
        this.addItemAndSave(item.id, item)

    }

    parseMultipleNew(path, text) {
        
        //remove any occurances of more than 2 new line chars e.g. \n\n\n... with \n\n
        const doubleNewLineInput = text.mutateWhile(
            s =>  /\n\s*\n\s*\n/g.test(s),
            s => s.replace(/\n\s*\n\s*\n/g, '\n\n')
        );

        const lines = doubleNewLineInput.split('\n\n').map(item=>item.trim()).filter(item=>item.length>0)

        const dictionary = this.getDictionary();
        
        for(let line of lines) {

            const item = {}
        
            item.id = uuid()
            item.path = path || this.path

            item.text = line
            item.complete = 0
            item.priority = 0
            item.tags = {}

            dictionary[item.id] = item;

        }

        this.save(dictionary);

    }
}

export default ToDoListManager