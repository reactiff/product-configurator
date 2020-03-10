export default (item, params) => {
    return !Object.keys(params).some(key => params[key] !== item[key]);
}