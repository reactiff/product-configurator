import { DateUtil } from '../../../shared/Util'

export default (period, today, cursor) => {

    if(period==='d'){
        return getDayTitle(today,cursor)
    }
    else if(period==='w'){
        return getWeekTitle(today,cursor)
    }
    else if(period==='m'){
        return getMonthTitle(today,cursor)
    }

}

function getDayTitle(today, cursor) {

    const dayDiff = DateUtil.diffDays(today, cursor)

    if(dayDiff===0){
        return 'TODAY'
    }

    const mondayBasedDay = cursor.getDay() === 0 ? 7 : cursor.getDay()


    if(dayDiff > 0){
        if(dayDiff === 1){
            return 'TOMORROW'
        }
        else if(dayDiff < 7){
            return DateUtil.weekDay[cursor.getDay()].toUpperCase()
        }
        else if(dayDiff >= 7 && dayDiff < mondayBasedDay + 7){
            return 'NEXT ' + DateUtil.weekDay[cursor.getDay()].toUpperCase()
        }
        else{
            return 'IN ' + dayDiff  + ' DAYS'
        }
    }

    if(dayDiff===-1){
        return 'YESTERDAY'
    }
    
    return Math.abs(dayDiff) + ' DAYS AGO'
    
}

function getWeekTitle(today, cursor) {

    const dayDiff = DateUtil.diffDays(today, cursor)
    const weekDiff = dayDiff / 7

    if(weekDiff===0){
        return 'THIS WEEK'
    }

    if(weekDiff > 0){
        if(weekDiff < 2){
            return 'NEXT WEEK'
        }
        else{
            return 'IN ' + weekDiff  + ' WEEKS'
        }
    }

    if(weekDiff===-1){
        return 'LAST WEEK'
    }
    
    return Math.abs(weekDiff) + ' WEEKS AGO'
    
}

var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

function getMonthTitle(today, cursor) {

    const thisMonthNumber = today.getFullYear() * 12 + (today.getMonth() + 1)
    const cursorMonthNumber = cursor.getFullYear() * 12 + (cursor.getMonth() + 1)

    const monthDiff = cursorMonthNumber - thisMonthNumber

    if(monthDiff===0){
        return 'THIS MONTH'
    }

    return monthNames[cursor.getMonth()].toUpperCase() + ' ' + cursor.getFullYear()
    
}

export function getMonthName(d) {
    return monthNames[d.getMonth()];
}