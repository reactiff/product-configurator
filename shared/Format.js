import {DateUtil} from './Util'
import React from 'react'
import ReactMarkdown from 'react-markdown'

const format = {

    phone: (str) => {
        var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        if (phoneRegex.test(str)) {
            return str.replace(phoneRegex, "($1) $2-$3")
        } else {
            // Invalid phone number
            return str
        }
    },

    roleName: (role) => {
        if(!role){
            return ''
        }
        switch(role) {
            case 'franchiseowner':
                return 'Studio Owner'
            default: 
                return role.toProperCase();
        }
    },


    
    displayFormat: (value, type) => {
        
        switch(type){
            case 'date':
                const d = DateUtil.parseAny(value)
                if(DateUtil.isDate(d)){
                    return value.month + '/' + value.day + '/' + value.year;
                }
                return ''
            case 'tel':
                return format.phone(value);
            case 'text':
            case 'textarea':
                return <ReactMarkdown source={value} />
            case 'string':
            case 'integer':
            case 'hidden':
            case 'video':
                return value;
            default:
                return value
        }
    }

}

export default format