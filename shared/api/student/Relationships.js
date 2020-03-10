// import React from 'react'

const relationships = {

    

    
    studio: { //all keys here will be resolved with api using provided urls and injected as fields directly into the items
        
        studioSchedule: (cls) => ({ module: "StudioSchedule" }),

        leaderboard: (studio) => ({ module: "Leaderboard" }),

        students: (studio) => ({ allow: "r", entityType: "profile", params: {role: 'student'}, hasView: true }),
        teachers: (studio) => ({ allow: "r", entityType: "profile", params: {role: 'teacher'}, hasView: true }),
        classes: (studio) => ({ allow: "r", entityType: "class", hasView: true }),
        classPackages: (studio) => ({ allow: "r", entityType: "classpackage", hasView: true }),
        
        // storeInventory: (studio) => ({ allow: "cr", entityType: "inventoryitem" }),
        // leaderboards: (studio) => ({ allow: "r", entityType: "leaderboarditem" }),
        // userGroups: (studio) => ({ allow: "crud", entityType: "group" }),
        // groupMembers: (studio) => ({ allow: "crud", entityType: "groupmembership" }),
    },

    classpackage: { 
        
        packageSchedule: (cls) => ({ module: "PackageSchedule" }),

        classes: (classPackage) => ({ allow: "r", entityType: "class", params: { partitionKey: null, classPackage: classPackage.id }, hasView: true }),

    },

    class: { 
        // classInfo: (cls) => ({ module: "ClassInfo" }),
        // schedule: (cls) => ({ module: "ClassSchedule" }),

        calendar: (teacher) => ({ module: "class/ClassCalendar" }),
    },
    
    student: {
        
        studentInfo: (student) => ({ module: "student/StudentInfo" }),
        studentSchedule: (student) => ({ module: "student/StudentCalendar" }),
        //awards: (student) => ({ allow: "r", entityType: "award" }),
        
    },

    teacher: {

        // info: (teacher) => ({ module: "teacher/TeacherInfo" }),
        calendar: (teacher) => ({ module: "teacher/TeacherCalendar" }),

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
