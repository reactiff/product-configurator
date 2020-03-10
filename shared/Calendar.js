import { ArrayUtil, DateUtil} from './Util'
import Config from './Config'
import {Inline} from './Util'

import Time from './Time'

import MapReduce from './MapReduce'

export default class Calendar { //Calendar
    
    constructor(){
        this.days = {};
        this.slotIntervalMinutes = Config.slotIntervalMinutes;
    }

    static fromDates(dates) {
        const calendar = new Calendar()
        for(let date of dates){
            const yyyymmdd = DateUtil.toYYYYMMDD(date)
            const availability = {}
            calendar.days[yyyymmdd] = {date: date, weekday: date.getDay(), availableSlots: [], events: [], bookings: [], availability: availability} 
        }
        return calendar
    }

    setAvailabilityRange(starttime, endtime) {
        const intervals = Time.getIntervals(starttime, endtime, Config.slotIntervalMinutes)
        const keys = Object.keys(this.days);
        for(let yyyymmdd of keys){
            for(let int of intervals){
                this.days[yyyymmdd].availability[int.toMilitary()] = 1
            }
        }
    }

    static getSample() {
        
        const limits = DateUtil.getWeekOf(new Date())
        const dates = DateUtil.getDateRange(...limits)

        const calendar = Calendar.fromDates(dates)

        for(let key in calendar.days){
            
            const day = calendar.days[key]
            const events = []
            const numEvents = parseInt(Math.random() * 3)

            for(let i=0; i< numEvents; i++){

                const rndStart = (parseInt(Math.random() * 9) + 9) * 100

                const durationIndex = parseInt(Math.random() * 3)

                const rndDuration = Inline.selectByIndex(durationIndex, 15, 30, 45, 100)
                
                events.push({ date: day.date, starttime: Time.fromMilitary(rndStart), endtime: Time.fromMilitary(rndStart + rndDuration) })
            }

            day.events = events
            
            delete day.availableSlots 
            delete day.availability 

        }

        

        return calendar
    }
    applyDaySchedule(daySchedule) {
      
        const workdays = ArrayUtil.toDictionary(
            daySchedule.filter(x=>x.type==='Workday'),
            day=>DateUtil.weekDay[day.weekday],
            day=>day)
      
        const holidays = ArrayUtil.toDictionary(
            daySchedule.filter(x=>x.type==='Holiday'),
            day=>DateUtil.dbDateToYYYYMMDD(day.date),
            day=>day)
      
        const extradays = ArrayUtil.toDictionary(
            daySchedule.filter(x=>x.type==='Extraday'),
            day=>DateUtil.dbDateToYYYYMMDD(day.date),
            day=>day)
                
      
        for(let yyyymmdd in this.days){

            const day = this.days[yyyymmdd]
            
            const weekday = DateUtil.getWeekday(day.date)
            
            if(workdays[weekday]){
                this.days[yyyymmdd].isBusinessDay = true
                this.days[yyyymmdd].type = 'Workday'
            } 
            if(holidays[yyyymmdd]){
                this.days[yyyymmdd].isBusinessDay = false
                this.days[yyyymmdd].type = 'Holiday'
                this.days[yyyymmdd].description = holidays[yyyymmdd].description
            }
            if(extradays[yyyymmdd]){
                this.days[yyyymmdd].isBusinessDay = true
                this.days[yyyymmdd].type = 'Extraday'
                this.days[yyyymmdd].description = extradays[yyyymmdd].description
            }
        }
        
    }

    addAvailability(timeslots) {
        applyTimeslots(this, timeslots)
    }

    subtractAvailability(timeslots) {
        applyTimeslots(this, timeslots, true)
    }
 
    createTimeslots(){
        
        for(let yyyymmdd in this.days){

            const day = this.days[yyyymmdd];
            const keys = Object.keys(day.availability).sort((a,b) => a-b);

            let timeslot;

            for(let i=0; i<keys.length; i++){
                
                const time = keys[i]
                const available = day.availability[keys[i]]

                if(!available) {
                    if(timeslot){
                        timeslot.endtime = Time.fromMilitary(time)
                        day.availableSlots.push(timeslot)
                        timeslot = null
                    }
                }
                else{
                    if(!timeslot){
                        timeslot = { entityType: 'timeslot', intervals: {}, date: day.date, options: { slotType: 'availability', title: 'Available'} }
                        timeslot.starttime = Time.fromMilitary(time)
                    }
                    timeslot.intervals[time] = { time: time }
                }
            }

            if(timeslot){
                const endTime = Time.fromMilitary(parseInt(keys[keys.length - 1]));
                endTime.addMinutes(Config.slotIntervalMinutes);
                timeslot.endtime = endTime;
                day.availableSlots.push(timeslot)
                timeslot = null
            }
        }

    }

    addEvents(events, options){

        const recurring = events.filter(x=>x.scheduletype.toLowerCase() === 'recurring')
        const nonrecurring = events.filter(x=>x.scheduletype.toLowerCase() !== 'recurring')
    
        
        for(let yyyymmdd in this.days){

            const day = this.days[yyyymmdd]

            const recurringForDay = recurring.filter(x => x.weekday === 99 || x.weekday === day.weekday)
            recurringForDay.map(event => {
                event.options = options
                return false
            })
            
            day.events = day.events.concat(recurringForDay)

            const nonrecurringForDay = nonrecurring.filter(x => DateUtil.dbDateToYYYYMMDD(x.date) === yyyymmdd)
            nonrecurringForDay.map(event => {
                event.options = options
                return false
            })
            
            day.events = day.events.concat(nonrecurringForDay)
            console.log('')
        }
    }

    addPlaceholders(timeslots, options){

        const recurring = timeslots.filter(x => {
            return x.scheduletype && x.scheduletype.toLowerCase() === 'recurring'
        })
    
        const nonrecurring = timeslots.filter(x => {
            return !(x.scheduletype && x.scheduletype.toLowerCase() === 'recurring')
        })

        
        for(let yyyymmdd in this.days){

            const day = this.days[yyyymmdd]

            const recurringForDay = recurring.filter(x => x.weekday === 99 || x.weekday === day.weekday)
            recurringForDay.map(event => {
                event.options = options
                event.isPlaceholder = true
                return false
            })
            
            day.events = day.events.concat(recurringForDay)

            const nonrecurringForDay = nonrecurring.filter(x => DateUtil.dbDateToYYYYMMDD(x.date) === yyyymmdd)
            nonrecurringForDay.map(event => {
                event.options = options
                event.isPlaceholder = true
                return false
            })
            
            day.events = day.events.concat(nonrecurringForDay)
            
        }
    }

    getMinTimeFromAvailability() {
        let best = 2400
        for(let yyyymmdd in this.days){
            const day = this.days[yyyymmdd]
            const keys = Object.keys(day.availability).map(x=>parseInt(x))
            const result = keys.find(key=>day.availability[key]===1)
            if(result<best){
                best = result
            }
        }
        return best 
    }
    getMaxTimeFromAvailability() {
        let best = 0
        for(let yyyymmdd in this.days){
            const day = this.days[yyyymmdd]
            const keys = Object.keys(day.availability).map(x=>parseInt(x))
            const result = keys.reverse().find(key=>day.availability[key]===1)
            if(result>best){
                best = result
            }
        }
        return best
    }

    getMinTimeFromSlots(slots){

        const result1 = MapReduce.min(slots, x => x.starttime)

        const result2 = this.slots.map(x=> x.starttime.toMilitary()).reduce((acc, time)=>Math.min(acc, time), 2400)

        return result1 || result2

    }
    
    getMaxTimeFromSlots(slots){
        const result1 = MapReduce.max(slots, x => x.endtime)
        
        const result2 = this.slots.map(x=> x.endtime.toMilitary()).reduce((acc, time)=>Math.max(acc, time), 0)

        return result1 || result2
    }

    

    getMinTime(){

        if(this.minTime){
            return this.minTime
        }

        const times = [
            MapReduce.min(this.days, d => MapReduce.min(d.events, e => e.starttime.toMilitary())),
            MapReduce.min(this.days, d => MapReduce.min(d.availableSlots, e => e.starttime.toMilitary())),
        ]

        return Math.min(...times)
    }

    getMaxTime(){

        if(this.maxTime){
            return this.maxTime
        }

        const times = [
            MapReduce.max(this.days, d => MapReduce.max(d.events, e => e.endtime.toMilitary())),
            MapReduce.max(this.days, d => MapReduce.max(d.availableSlots, e => e.endtime.toMilitary())),
        ]

        return Math.max(...times)
    }

    
    static createCalendar(dates, timeslots, bookings, scheduledays) {
        

        const calendar = Calendar.fromDates(dates)

        if(scheduledays){
            calendar.applyDaySchedule(scheduledays)
        }
        
        if(timeslots) {

            const recurringSchedules = timeslots.filter(x=>x.scheduletype.toLowerCase() === 'recurring')
            const customSchedules = timeslots.filter(x=>x.scheduletype.toLowerCase() !== 'recurring')
        
            for(let yyyymmdd in calendar.days){
    
                const day = calendar.days[yyyymmdd]
    
                //create events
                day.events = day.events
                                .concat(recurringSchedules.filter(x => x.weekday===99 || x.weekday === day.weekday))
                                .concat(customSchedules.filter(x => DateUtil.dbDateToYYYYMMDD(x.date) === yyyymmdd))
    
                //apply bookings
                bookings && day.events.map(event => {
                
                    const eventBookings = bookings.filter(booking => booking.timeslotId === event.id && DateUtil.dbDateToYYYYMMDD(booking.sessionDate) === yyyymmdd)
                    if(eventBookings.length>0){
                        event.bookings = eventBookings
                    }
                    
                    return event
                })

                day.events.sort((a,b) => a.starttime.toMilitary() - b.starttime.toMilitary())
            }
        }

        if(timeslots){
            //min time
            calendar.minTime = timeslots.reduce((a, x)=>{ return Math.min(a, x.starttime.toMilitary()) }, 2400)
            //max time
            calendar.maxTime = timeslots.reduce((a, x)=>{ return Math.max(a, x.endtime.toMilitary()) }, 0)
        }
        else{
            calendar.minTime = 900
            calendar.maxTime = 1800
        }
    
        return calendar
        
    }
}

function applyTimeslots(calendar, timeslots, subtract) {

    const apply = (day, dayTimeslots) => {
        for(let timeslot of dayTimeslots){
            const intervals = Time.getIntervals(timeslot.starttime, timeslot.endtime, Config.slotIntervalMinutes)
            for(let int of intervals){
                day.availability[int.toMilitary()] = subtract ? 0 : 1
            }
        }
    }

    const recurring = timeslots.filter(x => {
        return x.scheduletype && x.scheduletype.toLowerCase() === 'recurring'
    })

    const nonrecurring = timeslots.filter(x => {
        return !(x.scheduletype && x.scheduletype.toLowerCase() === 'recurring')
    })

    for(let yyyymmdd in calendar.days){
        const day = calendar.days[yyyymmdd]
        apply(day, recurring.filter(x => x.weekday === 99 || x.weekday === day.weekday))
        apply(day, nonrecurring.filter(x => DateUtil.dbDateToYYYYMMDD(x.date) === yyyymmdd))
    }

}
