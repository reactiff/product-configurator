import { isNumber } from "util"

//interface ISelectorFunction { (any):number }


const aggregate = (source, fn, select, defaultValue) => {

    if(!source){
        return defaultValue
    }

    return Object.keys(source)
        .map(key => {
            const item = { key: key, item: source[key] }
            return item
        })
        .reduce((acc, elem) => {
            
            const itemValue = select(elem.item, elem.key, source)

            // if(!isNumber(itemValue)){throw new Error(itemValue + ' is not a number')}

            const result = fn(acc, itemValue)

            return result

        }, defaultValue)

}

const fnConcat = (acc, arr) => {
    return acc.concat(arr)
}

const MapReduce = {

    map: (object, select) => Object.keys(object).map(key => select(object[key], key, object)),

    concat: (source, select) => aggregate(source, fnConcat, select, []),

    min: (source, select) => aggregate(source, Math.min, select, Number.MAX_VALUE),
    max: (source, select) => aggregate(source, Math.max, select, Number.MIN_VALUE),
}

export default MapReduce