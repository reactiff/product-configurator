String.prototype.mutateWhile = function(condition, transform) {
    let result = this;
    while(condition(result)){
        result = transform(result);
    }
    return result;
}

String.prototype.toCamelCase = function () {

    if(!this){
        return 
    }

    const temp = this.replace(/\s/g, "").trim()

    if(temp.length===0){
        return ''
    }

    return temp[0].toLowerCase() + temp.substring(1)
}


String.prototype.camelToSentenceCase = function () {
    const tokens = this.replace(/([A-Z]+)/g, " $1").trim().split(' ')

    return tokens.filter(t=>t && t.length).map(token => {
        const trimmed = token.trim()
        return trimmed[0].toUpperCase() + trimmed.substring(1)
    }).join(' ')
}

String.prototype.camelToKebabCase = function () {
    const tokens = this.replace(/([A-Z]+)/g, " $1").trim().split(' ')
    return tokens.map(token => {
        return token.trim().toLowerCase()
    }).join('-')
}

String.prototype.toProperCase = function() {
    if(this.length){
        return this[0].toUpperCase() + this.substring(1)
    }
}


String.prototype.right = function(number) {
    if(this.length){
        return this.substring(this.length - number)
    }
}

String.prototype.asPhone = function() {
    const phoneNumberString = this
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return null
}

function formatPhoneNumber(phoneNumberString) {
    
  }

export default 'StringExt.js'