Array.prototype.toDictionary = function (keySelector = (item)=>item.id, valueSelector = (item)=>item) {
    const dict = {}
    for(let i=0; i<this.length; i++) {
        const key = keySelector(this[i], i)
        const value = valueSelector(this[i], i)
        dict[key] = value
    }
    return dict
}

Array.prototype.all = function (qualifier) {
    var someAreFalse = this.some(function (x) {
        var result = qualifier(x);
        return !result;
    });
    return !someAreFalse;
}

export default 'ArrayExt.js'