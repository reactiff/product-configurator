
class LocalStorageDictionary {

    id = null;
    
    constructor(id) {
        
        this.id = id;

        
    }

    getDictionary() {
        //init from local storage 
        const json = localStorage.getItem(this.id) || '{}';
        return JSON.parse(json);
    }

    save(dictionary){
        if(!dictionary){
            throw new Error('Dictionary is null or undefined')
        }
        localStorage.setItem(this.id, JSON.stringify(dictionary));
    }

    getItem(key){
        const dictionary = this.getDictionary();
        return dictionary[key];
    }


    addItemAndSave(key, item){
        const dictionary = this.getDictionary();
        dictionary[key] = item;
        this.save(dictionary);
    }

    replaceItem(key, item) {
        const dictionary = this.getDictionary();
        dictionary[key] = item;
        this.save(dictionary);
    }

    deleteItem(key) {
        const dictionary = this.getDictionary();
        delete dictionary[key]
        this.save(dictionary);
    }

    getKeys() {
        const dictionary = this.getDictionary();
        let results = Object.keys(dictionary);
        return results;
    }
    getItems(options) {
        const dictionary = this.getDictionary();
        let results = Object.keys(dictionary).map(key => dictionary[key]);
        if(options){
            if(options.filter){
                results = results.filter(options.filter);
            }
            if(options.sort){
                results.sort(options.sort);
            }
        }
        return results;
    }

    keyValuePairs(options) {
        const dictionary = this.getDictionary();
        let results = Object.keys(dictionary).map(key => ({ key: key, value: dictionary[key]}));
        if(options){
            if(options.filter){
                results.filter(options.filter);
            }
            if(options.sort){
                results.sort(options.sort);
            }
        }
        return results;
    }
}

export default LocalStorageDictionary