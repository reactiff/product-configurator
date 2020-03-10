Date.prototype.elapsedString = function() {

    const e = this.getElapsedTimeSpan()
    
    const getString = (n, unit) => {
        if(Math.abs(n)>1){
            return n + ' ' + unit + 's ago'
        }
        else{
            return n + ' ' + unit + ' ago'
        }
    }

    if(e.totalYears) {
        return getString(e.totalYears, 'year')
    }
    else if(e.totalMonths) {
        return getString(e.totalMonths, 'month')  
    }
    else if(e.totalWeeks) {
        return getString(e.totalWeeks, 'week')   
    }
    else if(e.totalDays) {
        return getString(e.totalDays, 'day')
    }
    else if(e.totalHours) {
        return getString(e.totalHours, 'hour')
    }
    else if(e.totalMinutes) {
        return getString(e.totalMinutes, 'minute')
    }
    
    return getString(e.totalSeconds, 'second')

}

Date.prototype.getElapsedTimeSpan = function() {

    const then = this.getTime()
    const now = (new Date()).getTime()

    const diff = now - then
    
    const totalSeconds = Math.floor(diff / 1000)
    const totalMinutes = (totalSeconds - (totalSeconds % 60)) / 60
    const totalHours = (totalMinutes - (totalMinutes % 60)) / 60
    const totalDays = (totalHours - (totalHours % 24)) / 24
    const totalWeeks = (totalDays - (totalDays % 7)) / 7
    const totalMonths = (totalDays - (totalDays % 30)) / 30
    const totalYears = (totalMonths - (totalMonths % 12)) / 12
    
    return {
        totalSeconds: Math.floor(diff / 1000),
        totalMinutes: (totalSeconds - (totalSeconds % 60)) / 60,
        totalHours: (totalMinutes - (totalMinutes % 60)) / 60,
        totalDays: (totalHours - (totalHours % 24)) / 24,
        totalWeeks: (totalDays - (totalDays % 7)) / 7,
        totalMonths: (totalDays - (totalDays % 30)) / 30,
        totalYears: (totalMonths - (totalMonths % 12)) / 12
    }

}