import Time from './Time'

class Timeslot { 
    
    static parseSessions(items) {
        return items.map(item=>{
            const parsed = {}
            Object.assign(parsed, item)
            parsed.date =  item.sessionDate
            parsed.starttime = Time.parse(item.sessionStartTime)
            parsed.endtime = Time.parse(item.sessionEndTime)
            return parsed
        })
    }

    static parseBookings(items) {
        return items.map(item=>{
            const parsed = {}
            Object.assign(parsed, item)
            parsed.date =  item.sessionDate
            parsed.starttime = Time.parse(item.sessionStartTime)
            parsed.endtime = Time.parse(item.sessionEndTime)
            return parsed
        })
    }

    static parseTimeslots(items) {
        return items.map(item=>{
            const parsed = {}
            Object.assign(parsed, item)
            parsed.starttime = Time.parse(item.starttime)
            parsed.endtime = Time.parse(item.endtime)
            return parsed
        })
    }

    

    

    
}

export default Timeslot