export default {

    session: (itema, itemb) => { 
                
        const a = itema.isEntity ? itema.item : itema
        const b = itemb.isEntity ? itemb.item : itemb

        const astr = a.sessionDate.yyyymmdd + a.sessionStartTime.toString().padStart(4, '0')
        const bstr = b.sessionDate.yyyymmdd + b.sessionStartTime.toString().padStart(4, '0')
        
        a.sortKey = astr
        b.sortKey = bstr

        const result = parseInt(bstr) - parseInt(astr)

        return result
    
    }
}