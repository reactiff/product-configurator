
export const fnOrValue = (element) => {
    if(typeof element === 'function'){
        return element()
    }
    return element
}


export default {

    /**
     * Returns a matching element from key1, value1, key2, value2... args following the defaultElement.  Each key argument can be an array of alternative keys for the corresponding element.
     * @param key - key: Selector value
     * @param defaultElement - defaultElement: Default return value
     */
    switch(key, defaultElement /*, pairs */) {
        for(let i = 2; i<arguments.length; i+=2){
            if(Array.isArray(arguments[i])){
                if(arguments[i].some(value => value === key)){
                    return fnOrValue(arguments[i + 1])
                }
            }
            else{
                if(key === arguments[i]){
                    return fnOrValue(arguments[i + 1])
                }
            }
        }
        return fnOrValue(arguments[1]) //default
    },

    select(/*, pairs */) {

        for(let i = 0; i<arguments.length; i+=2){
            if(arguments[i]){
                return fnOrValue(arguments[i + 1])
            }
        }
        
    },

    selectByIndex(index, ...values) {
        return values[index]
    }

}
 
