export const DateUtil = {
    weekDay: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
    },
    addDays: (date, days) => {
        var newdate = new Date(date.valueOf())
        newdate.setDate(newdate.getDate() + days)
        return newdate
    }, 

    toYYYYMMDD: (date) => {
        return date.getFullYear() + '' + (date.getMonth() + 1).toString().padStart(2, '0') + '' + date.getDate().toString().padStart(2, '0')
    }, 
    toYYYY_MM_DD: (d) => {

        const date = DateUtil.parseAny(d)

        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
    }, 
    getDateRange: (d1, d2) => {
        let cursor = d1
        const results = []
        while(cursor<=d2) {
            results.push(cursor)
            cursor = DateUtil.addDays(cursor, 1)
        }
        return results
    }, 
    dbDateToYYYYMMDD: (value) => {
        return value.year + '' + value.month.toString().padStart(2, '0') + '' + value.day.toString().padStart(2, '0')
    },
    dbDateToYYYY_MM_DD: (value) => {
        return value.year + '-' + value.month.toString().padStart(2, '0') + '-' + value.day.toString().padStart(2, '0')
    },
    isDate: (d) => {
        return d instanceof Date && !isNaN(d.valueOf())
    },
    getWeekday: (d) => {
        if(DateUtil.isDate(d)){
            return DateUtil.weekDay[d.getDay()]
        }
        return ''
    },
    getMonthEndDate: (d) => {
        const midMonth = new Date(d.getFullYear(), d.getMonth(), 15)
        const nextMonth = DateUtil.addDays(midMonth, 30) //this puts us in the middle of the following month and year
        const firstDayOfNextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1)
        const monthEnd = DateUtil.addDays(firstDayOfNextMonth, -1)
        return monthEnd
    },
    getMondayOf: (d) => {
        let todaysWeekDay = d.getDay();
        if(todaysWeekDay===0){
            todaysWeekDay = 7 
        } 
        const sunday = DateUtil.addDays(d, -todaysWeekDay)
        const monday = DateUtil.addDays(sunday, 1)
        return monday
    },
    getWeekOf: (d) => {
        const monday = DateUtil.getMondayOf(d)
        const weekEnd = DateUtil.addDays(monday, 6)
        return [monday, weekEnd]
    },
    getPeriod: (d, period) => {
        const today = d
        switch(period) {
            case 'd':
                return [today, today]
            case 'm':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
                const monthEnd = DateUtil.getMonthEndDate(today)
                return [monthStart, monthEnd]
            default:
                return DateUtil.getWeekOf(today)
        }
    },
    today: () => {
        return DateUtil.parseAny(new Date())
    },
    parseDbDate: (dbdate) => {
        return DateUtil.parseAny(dbdate)
    },

    isDbDate: (value) => {
        if(!value){
            return false
        }
        if(value.year && value.month && value.day){
            return true
        }
        return false
    },

    asInputValue: (date) => {

        if(DateUtil.isDate(date)){
            return DateUtil.toYYYY_MM_DD(date)
        }
        if(DateUtil.isDbDate(date)){
            return DateUtil.dbDateToYYYY_MM_DD(date)
        }

    }, 

    todayInt: () => {
        const d = new Date()
        const today = parseInt(DateUtil.toYYYYMMDD(d))
        return today
    },
    
    parseAny: (date) => {
        if(!date){
            return null
        }
        if(date instanceof Date && !isNaN(date.valueOf())){
            return new Date(date.getFullYear(), date.getMonth(), date.getDate())
        }
        
        if(date.year && date.month && date.day){
            return new Date(date.year, date.month-1, date.day)
        }
        
        if(typeof date === 'string') { 
            if(date.length===8){
                const str = date
                const dd = [str.substring(0,4), str.substring(4,6), str.substring(6)]
                return new Date(dd[0], parseInt(dd[1])-1, dd[2])       
            }
            else{
                const [d,t] = date.split('T')
                const [yyyy,mm,dd] = d.split('-')
                return new Date(yyyy,mm-1,dd)
            }
        }
        
        if(typeof date == 'number') {
            if(date.toString().length===8){
                const str = date.toString()
                const dd = [str.substring(0,4), str.substring(4,6), str.substring(6)]
                return new Date(dd[0], parseInt(dd[1])-1, dd[2])       
            }
            else{
                const d = new Date(date)
                return new Date(d.getFullYear(), d.getMonth(), d.getDate())       
            }
        }  
    },

    diffDays: (a, b) => {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        function dateDiffInDays(a, b) {
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }
        return dateDiffInDays(a, b);
    }
}



export const dictionary = (arr, keySelector = (item)=>item.id, valueSelector = (item)=>item) => {
    return ArrayUtil.toDictionary(arr, keySelector, valueSelector)
}

export const ArrayUtil = {
    
    /**
     * Converts an array to Dictionary.
     * @param items Item array
     * @param itemHashGetter - itemHashGetter:  e.g. (x,i) => x.id
     * @param itemValueGetter - (optional) itemValueGetter:  e.g. (x,i) => x.value
     */
    toDictionary: (items, keySelector = (item)=>item.id, valueSelector = (item)=>item) => {
        const dict = {}
        for(let i=0; i<items.length; i++) {
            const key = keySelector(items[i], i)
            const value = valueSelector(items[i], i)
            dict[key] = value
        }
        return dict
    }

}



// export const StringUtil = {

//     mutateWhile: (condition, transform, data) => {
//         let result = data;
//         while(condition(result)){
//             result = transform(result);
//         }
//         return result;
//     },

//     camelCaseToSentence: (str) => {
        
//         const tokens = str.trim().replace(/([A-Z]+)/g, " $1").split(' ')

//         return tokens.filter(t=>t && t.length).map(token => {
//             const trimmed = token.trim()
//             return trimmed[0].toUpperCase() + trimmed.substring(1)
//         }).join(' ')

//         //.replace(/([A-Z][a-z])/g, " $1").trim()
        
//     }, 

//     camelCaseToKebab: (str) => {
      
//         const tokens = str.trim().replace(/([A-Z]+)/g, " $1").split(' ')

//         return tokens.map(token => {
//             return token.trim().toLowerCase()
//         }).join('-')
        
//     }, 

//     properCase: (str) => {
//         if(!str || str.length<1){
//             return str
//         }
//         return str[0].toUpperCase() + str.substring(1)
//     }


// }

export const fnOrValue = (element) => {
    if(typeof element === 'function'){
        return element()
    }
    return element
}

export const Inline = {

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
 
