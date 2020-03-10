export default {

    phone: (str) => {
        var phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
        if (phoneRegex.test(str)) {
            return true
        } else {
            return false
        }
    },

    

}