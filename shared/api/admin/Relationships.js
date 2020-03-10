import { DateUtil } from "../../Util"
import Sort from "../../Sort"

// import React from 'react'

const relationships = {

    announcement: {
        info: (announcement) => ({ module: "announcement/AnnouncementInfo" }),
    },
    attendee: { 

    },
    classcategory: { 

    },
    contact: { 

    },
    group: { 

    },
    groupmembership: { 

    },
    inventory: { 

    },
    inventoryitem: { 

    },
    leaderboard: { 

    },
    offering: { 

    },
    page: { 

    },
    playlist: { 

    },
    profile: { 

    },
    session: {
        
    },

    store: {

    },

    

    studio: { //all keys here will be resolved with api using provided urls and injected as fields directly into the items
        
        studioSchedule: (studio) => ({ module: "StudioSchedule" }),

        announcements: (studio) => ({ allow: "cr", entityType: "announcement", hasView: true,
            views: {
                published: { 
                    filter: ({item:x}) => {
                        return x.published
                    }
                },
                unpublished: { 
                    filter: ({item:x}) => {
                        return !x.published
                    }
                }
            } 
        }),

        leaderboard: (studio) => ({ module: "Leaderboard" }),

        students: (studio) => ({ allow: "r", entityType: "profile", params: {role: 'student'}, hasView: true }),
        teachers: (studio) => ({ allow: "r", entityType: "profile", params: {role: 'teacher'}, hasView: true }),
        classes: (studio) => ({ allow: "cr", entityType: "class", hasView: true }),
        classPackages: (studio) => ({ allow: "cr", entityType: "classpackage", hasView: true }),
        scheduleDays: (studio) => ({ allow: "crud", entityType: "scheduleday" }),
        expenses: (studio) => ({ allow: "crud", entityType: "expense" }),
        
        // storeInventory: (studio) => ({ allow: "cr", entityType: "inventoryitem" }),
        // leaderboards: (studio) => ({ allow: "r", entityType: "leaderboarditem" }),
        // userGroups: (studio) => ({ allow: "crud", entityType: "group" }),
        // groupMembers: (studio) => ({ allow: "crud", entityType: "groupmembership" }),
    },

    classpackage: { 
        
        packageSchedule: (classPackage) => ({ module: "PackageSchedule" }),
        classes: (classPackage) => ({ allow: "r", entityType: "class", params: { partitionKey: null, classPackage: classPackage.id }, hasView: true }),

    },

    class: { 

        classInfo: (cls) => ({ module: "ClassInfo" }),
        classSchedule: (cls) => ({ module: "ClassSchedule" }),

        sessions: (cls) => ({ allow: "r", entityType: "session", params: { classId: cls.id }, hasView: true, 

            sort: Sort.session,

            views: {
                upcoming: { 
                    filter: ({item:x}) => {
                        return x.sessionDate.yyyymmdd >= DateUtil.todayInt()
                    }
                },
                unassigned: { 
                    filter: ({item:x}) => {
                        return x.sessionDate.yyyymmdd >= DateUtil.todayInt() && !x.teacherId
                    }
                },
                past: { 
                    filter: ({item:x}) => {
                        return x.sessionDate.yyyymmdd < DateUtil.todayInt()
                    }
                },
                all: { 
                    filter: ({item:x}) => {
                        return true
                    }
                },
            }

        
        }),

        timeslots: (cls) => ({ allow: "crud", entityType: "timeslot" }),
    },
    
    student: {
        
        studentInfo: (student) => ({ module: "student/StudentInfo" }),
        studentSchedule: (student) => ({ module: "student/StudentCalendar" }),

        attendance: (student) => ({ allow: "r", entityType: "attendee", params: { partitionKey: null, studentId: student.id } }),
        bookings: (student) => ({ allow: "r", entityType: "booking" }),
        // videos: (student) => ({ allow: "crud", entityType: "playlistitem", params: { type: 'video' } }),
        // orders: (student) => ({ allow: "r", entityType: "order" }),
        contacts: (student) => ({ allow: "cr", entityType: "contact" }),
        paymentMethods: (student) => ({ allow: "r", entityType: "paymentmethod" }),

        photos: (student) => ({ allow: "cr", entityType: "photoalbum", hasView: true }),
        videos: (student) => ({ allow: "cr", entityType: "videoalbum", hasView: true }),

        

        // invoices: (student) => ({ allow: "r", entityType: "invoice" }),
        // memberships: (student) => ({ allow: "r", entityType: "membership" }),
        //awards: (student) => ({ allow: "r", entityType: "award" }),
        //grades: (student) => ({ allow: "r", entityType: "grade" }),
        //invitations: (student) => ({ allow: "r", entityType: "invitation" }),
        
    },

    teacher: {

        teacherInfo: (teacher) => ({ module: "teacher/TeacherInfo" }),
        teacherSchedule: (teacher) => ({ module: "teacher/TeacherCalendar" }),

        checkIns: (teacher) => ({ allow: "r", entityType: "checkin" }),
        // facts: (teacher) => ({ allow: "crud", entityType: "fact" }),
        timeslots: (teacher) => ({ allow: "crud", entityType: "timeslot" })
    },

    photoalbum: {

        photos: (student) => ({ module: "photoalbum/PhotoAlbumManager" }),
        settings: (student) => ({ module: "photoalbum/PhotoAlbumSettings" }),

    },

    videoalbum: {

        videos: (student) => ({ module: "videoalbum/VideoAlbumManager" }),
        settings: (student) => ({ module: "videoalbum/VideoAlbumSettings" }),

    },

    user: { 

    },
    userrole: { 

    },

}

export default {
    
    relationshipsForItem: (item, type) => {
        const specializedTypeName = (type.specializationKey && item[type.specializationKey]) || type.name
        const rel = relationships[specializedTypeName]
        if(!rel){
            return []
        }
        const coll = Object.keys(rel).map(key => ({key: key, ...rel[key](item)}))
        return coll
    },

    relationships: relationships
}
