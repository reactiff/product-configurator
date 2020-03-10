

export const isReactElement = (value) => {
    if(!value) {
        return false
    }
    const valueType = typeof value.$$typeof
    if(value && (valueType === 'symbol')) {
        if(value._owner){
            return true
        }
    }
    return false
}

const indent = (num) => {
    return ''.padStart(num, ' ')
}

const reactElementToString = (value, indentation = 0) => {

    if(!isReactElement(value)){
        return indent(indentation) + value
    }

    let children

    if(Array.isArray(value.props.children))
    {
        children = value.props.children.map(child => {
            const output = reactElementToString(child, indentation + 2)
            return output
        })   
    }
    else if(isReactElement(value.props.children)){
        children = [reactElementToString(value.props.children, indentation + 2)]
    }
    else {
        children = [indent(indentation + 2) + value.props.children]
    }

    const content = children.join('\n')
    let tagName = value.type
    
    if(typeof tagName === 'symbol'){
        tagName = ''
    }

    return indent(indentation) + '<'+tagName+'>\n' +
    content + '\n' + 
    indent(indentation) + '</'+tagName + '>'

}

const symbols = []
const excludedKeys = ['key', 'ref', '_owner', '_store']
const replacer = function (key, value) {

    if(excludedKeys.includes(key)){
        return null
    }

    if(isReactElement(value)){
        
        

        const id = '$$$' + (symbols.length + 1)

        const mockJsx = reactElementToString(value, 4)

        symbols.push({id: id, string: '(\n' + mockJsx + '\n' + indent(4) + ')'})

        return id
    }
    else if(typeof value === 'function'){

        const id = '$$$' + (symbols.length + 1)

        const fnCode = value.toString()

        symbols.push({id: id, string: fnCode})

        return id

    }
    
    

    return value
}


const Stringify = (data) =>{

    if(data === null || typeof data === 'undefined'){
        return null
    }

    let dataString = JSON.stringify(data, replacer, '  ')

    symbols.map(symbol => {
        dataString = dataString.replace('"' + symbol.id + '"', symbol.string)
        return true
    })

    return dataString

} 


export default Stringify


