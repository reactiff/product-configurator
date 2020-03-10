import uuid from 'uuid/v4';
import StringExt from './StringExt'
import api from './Api';

class NotesClient {
    
    constructor() {
        this.path = null;
        this.onRevision = null;
        this.onItems = null;
    }
    
    parseTags(tagString) {
        const result = {};
        if(tagString && tagString.trim().length){
            const arr = tagString.trim().toLowerCase().split(' ').map(item=>item.trim()).filter(item=>item.length>0)
            for(let tag of arr){
                result[tag] = true;
            }
        }
        return result;
    }

    parseNew(model) {
    
        const item = {};
    
        item.path = model.path || this.path;
        item.text = model.text;
        item.vector = model.vector;
        item.tagString = model.tagString;
        item.tags = this.parseTags(model.tagString);

        api.post('/note', item)
            .then(json => {
                if(!json.ok){
                    alert('Unable to add new note.  Please try again later.');
                }
                if(this.onRevision){
                    this.onRevision();
                }
            })
            .catch(reason => {
                alert('Unable to add new note.  Please try again later.');
            });

    }

    parseMultipleNew(path, text, tagString) {
        
        //remove any occurances of more than 2 new line chars e.g. \n\n\n... with \n\n
        const doubleNewLineInput = text.mutateWhile(
            s =>  /\n\s*\n\s*\n/g.test(s),
            s => s.replace(/\n\s*\n\s*\n/g, '\n\n')
        );

        const lines = doubleNewLineInput.split('\n\n').map(item=>item.trim()).filter(item=>item.length>0)

        for(let line of lines) {

            const item = {}
        
            item.path = path || this.path;
            item.text = line1;
            item.vector = vector;
            item.tagString = tagString;
            item.tags = this.parseTags(tagString);

            api.post('/note', item)
                .then(json => {
                    if(!json.ok){
                        alert('Unable to add new note.  Please try again later.');
                    }
                    if(this.onRevision){
                        this.onRevision();
                    }
                })
                .catch(reason => {
                    alert('Unable to add new note.  Please try again later.');
                });
        }
    }

    searchText(query, setQueryExpressions) {
        try{

            if(query.trim().length===0){
                setQueryExpressions([])
                return
            }

            const parts = query.toLowerCase().split(' ').filter(t => t.trim().length)

            const tokens = []

            //each token is an AND
            for(let str of parts){

                let exp = str

                let negate = false
                let matchTag = false

                if(exp[0] === '!') { 
                    negate = true
                    exp = exp.substring(1)
                }

                if(exp[0] === '#') { 
                    matchTag = true
                    exp = exp.substring(1)
                }

                // if(exp[0]!=='('){
                //     exp = '(' + exp + ')'
                // }

                tokens.push({type: 'and', negate: negate, tags: matchTag, pattern: new RegExp(exp, 'gimu')})
            }

            setQueryExpressions(tokens)

        }
        catch(ex){
            setQueryExpressions([])
        }
    }

    getItems(setItems) {
        api.get('/notes?path=' + this.path + '*')
        .then(response => {
            if(response.ok){
                this.onItems(response.data);
            }
        })
    }
}

export default ToDoListManager