// import React from 'react'

const relationships = {

    attendee: { 

    },
    
    session: {
        
    },
    
    studio: {
        
        studioSchedule: (cls) => ({ module: "StudioSchedule" }),

        students: (studio) => ({ allow: "r", entityType: "profile", params: {role: 'student'}, hasView: true }),
        classes: (studio) => ({ allow: "r", entityType: "class", hasView: true }),
 
    },

    class: { 

        classInfo: (cls) => ({ module: "ClassInfo" }),
        classSchedule: (cls) => ({ module: "ClassSchedule" }),
        //timeslots: (cls) => ({ allow: "crud", entityType: "timeslot" }),
    },
    
    student: {
        
        studentInfo: (student) => ({ module: "StudentInfo" }),
        studentSchedule: (cls) => ({ module: "StudentSchedule" }),

        attendance: (student) => ({ allow: "r", entityType: "attendee", params: { partitionKey: null, studentId: student.id } }),
        bookings: (student) => ({ allow: "r", entityType: "booking" }),
        videos: (student) => ({ allow: "r", entityType: "playlistitem", params: { type: 'video' } }),
        // orders: (student) => ({ allow: "r", entityType: "order" }),
        contacts: (student) => ({ allow: "r", entityType: "contact" }),
        
        // invoices: (student) => ({ allow: "r", entityType: "invoice" }),
        // memberships: (student) => ({ allow: "r", entityType: "membership" }),
        //awards: (student) => ({ allow: "r", entityType: "award" }),
        //grades: (student) => ({ allow: "r", entityType: "grade" }),
        //invitations: (student) => ({ allow: "r", entityType: "invitation" }),
        
    },

    teacher: {

        scheduleDays: (studio) => ({ allow: "crud", entityType: "scheduleday" }),
        timeslots: (teacher) => ({ allow: "crud", entityType: "timeslot" })

    },

    

}

export default {
    
    relationshipsForItem: (item, type) => {
        const specializedTypeName = (type.specializationKey && item[type.specializationKey]) || type.name
        const rel = relationships[specializedTypeName]
        const coll = Object.keys(rel).map(key => ({key: key, ...rel[key](item)}))
        return coll
    },

    relationships: relationships
}
