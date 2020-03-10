export default class Time {

    constructor(hh,mm){
        this.hh = parseInt(hh)
        this.mm = parseInt(mm)
        this.value = this.hh * 100 + this.mm
    }

    

    /**
     * Parses military HH:MM string and returns Time object
     * @param {*} timeString - timeString: HH:MM
     */
    static parse(timeString){
        if(typeof timeString === 'number'){
            return Time.fromMilitary(timeString)
        }
        if(typeof timeString === 'string' && timeString.trim().length>0 && timeString.indexOf(' ')<0){
            return Time.fromMilitary(parseInt(timeString))
        }
        const tokens = timeString.split(' ')
        const last = tokens[tokens.length-1].toLowerCase()
        if(last==='am' || last==='pm'){
            const pm = last==='pm' ? true : false
            const clean = timeString.substring(0, timeString.length-3).trim()
            let [hh, mm] = clean.split(':')
            if(pm && hh !== '12'){
                hh = parseInt(hh) + 12
            }
            return new Time(hh, mm)
        }
        const [hh, mm] = timeString.split(':')
        return new Time(hh, mm)
    }
    clone() { 
        return new Time(this.hh, this.mm);
    }
    addMinutes(mm) {
        this.mm += mm;
        while(this.mm >= 60){
            this.hh++;
            this.mm -= 60;
        }
        this.value = this.hh * 100 + this.mm;
        return this;
    }
    toMilitary(){
        return this.hh * 100 + this.mm;
    }
    isLT(reftime){
        return this.toMilitary() < reftime.toMilitary();
    }
    isLToE(reftime){
        return this.toMilitary() <= reftime.toMilitary();
    }
    isGToE(reftime){
        return this.toMilitary() >= reftime.toMilitary();
    }
    isGT(reftime){
        return this.toMilitary() > reftime.toMilitary()
    }
    isBetween(start, end, inclusive){
        if(inclusive){
            return this.isGToE(start) && this.isLToE(end);
        }
        return this.isGToE(start) && this.isLT(end);
    }
    /**
     * Returns Hour formatted for am/pm
     */
    asH(){
        if(this.hh===12){
            return this.hh.toString();
        }
        return (this.hh % 12).toString();
    }
    /**
     * Returns Hour formatted for military
     */
    asHH(){
        return (this.hh).toString().padStart(2, '0');
    }
    /**
     * Returns Minutes padded with 0
     */
    asMM(){
        return this.mm.toString().padStart(2, '0');
    }
    asAmPm(){
        return this.toMilitary() >= 1200 ? 'pm' : 'am';
    }

    asHHMMKey() {
        return this.asHH() + ':' + this.asMM();
    }


    asHH_COLON_MM_AMPM() {
        return this.asH() + ':' + this.asMM() + ' ' + this.asAmPm().toUpperCase();
    }

    asHH_COLON_MM_ampm() {
        return this.asH() + ':' + this.asMM() + ' ' + this.asAmPm().toLowerCase();
    }
    
    toAmericanTime() {
        return this.asHH_COLON_MM_ampm();
    }

    static fromMilitary(hhmm) {
        const mm = hhmm % 100;
        return new Time((hhmm - mm)/100, mm);
    }

    static getDuration(t1, t2) {

        let total = (t2.hh - t1.hh) * 60 - t1.mm + t2.mm

        let minutes = total % 60
        

        const span = {
            totalMinutes: total,
            hours: (total - minutes) / 60,
            minutes: minutes
        }

        return span
    }

    static getIntervals(startTime, endTime, stepMM, inclusive) {
        let time = startTime.clone()
        const results = []
        while(time.isBetween(startTime, endTime, inclusive)) {
            results.push(time.clone())
            time.addMinutes(stepMM)
        }
        return results
    }
}
