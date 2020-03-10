import api from "../../Api";

function createChildForEntity(parent) {
    const child = {};
    child.partitionKey	= parent.id;
    child.parentType = parent.type;
    child.parentId	= parent.id;
    child.parentPartition = parent.partition;
    return child;
} 

function withKeysForUpdate(item, keys) {
    return {
        item: item,
        keys: keys
    };
}

const actions = {

    usergroup: {

        //returns a tuple: [ object, saveObject ] 
        // notification: { add: (usergroup) => [createChildForEntity(usergroup), newItem => api.post('/notification', newItem)]},


    },
    
    profile: {  
        // notification: { add: (profile) => [createChildForEntity(profile), newItem => api.post('/notification', newItem)]},
        // passwordchangerequest: { add: (profile) => [createChildForEntity(profile), newItem => api.post('/passwordchangerequest', newItem)]},
    },

    studio: { 
        
        // store: { add: (studio) => [createChildForEntity(studio), newItem => api.post('/store', newItem)]},
        createLeaderboard: {
            action: (studio) => api.action(studio, 'createLeaderboard')
        }
        
    },

    class: {  

        // playlist: { add: (cls) => [createChildForEntity(cls), newItem => api.post('/playlist', newItem)]},

    },

    student: { 
        //order: { add: (student) => [createChildForEntity(student), newItem => api.post('/order', newItem)]},
        //membership: { add: (student) => [createChildForEntity(student), newItem => api.post('/membership', newItem)]},
        //award: { add: (student) => [createChildForEntity(student), newItem => api.post('/award', newItem)]},
        //grade: { add: (student) => [createChildForEntity(student), newItem => api.post('/grade', newItem)]},
        //invitation: { add: (student) => [createChildForEntity(student), newItem => api.post('/invitation', newItem)]},
        //playlist: { add: (student) => [createChildForEntity(student), newItem => api.post('/playlist', newItem)]},
        //attendancerecord: { add: (student) => [createChildForEntity(student), newItem => api.post('/attendancerecord', newItem)]},


        calculateStats: {
            action: (student) => api.action(student, 'calculateStats')
        },

    },

    teacher: { 

        // checkin: { add: (teacher) => [createChildForEntity(teacher), newItem => api.post('/checkin', newItem)]},

    },

    membership: { 
        //fix all

        // actions: {

        //     setActive: (membership) => [withKeysForUpdate(membership, ['active']), updatedItem => api.put('/membership', updatedItem)],
        //     setStatus: (membership) => [withKeysForUpdate(membership, ['status']), updatedItem => api.put('/membership', updatedItem)],
        //     setLevel: (membership) => [withKeysForUpdate(membership, ['level']), updatedItem => api.put('/membership', updatedItem)],
        //     setDiscount: (membership) => [withKeysForUpdate(membership, ['discount']), updatedItem => api.put('/membership', updatedItem)],
        //     setPoints: (membership) => [withKeysForUpdate(membership, ['points']), updatedItem => api.put('/membership', updatedItem)],

        //     setAnnualGrades: (membership) => [withKeysForUpdate(membership, ['gradeYear', 'conductGrade', 'skillGrade']), updatedItem => api.put('/membership', updatedItem)]
            
        // }

    },

    playlist: {
        // playlistitem: { add: (playlist) => [createChildForEntity(playlist), newItem => api.post('/playlistitem', newItem)]},

    },

    store: {
        
        // offering: { add: (store) => [createChildForEntity(store), newItem => api.post('/offering', newItem)]},
        // transaction: { add: (store) => [createChildForEntity(store), newItem => api.post('/transaction', newItem)]},

        // inventory: { 
        //     add: (store) => [createChildForEntity(store), newItem => api.post('/inventory', newItem)]
        // },

        // actions: {
        //     setInventory: (store) => [withKeysForUpdate(store, ['inventoryId']), updatedItem => api.put('/store', updatedItem)]
        // }

    },

    offering: {
        
        // promotion: { add: (offering) => [createChildForEntity(offering), newItem => api.post('/promotion', newItem)]},

    },

    inventory: { 
        
        // inventoryitem: { add: (inventory) => [createChildForEntity(inventory), newItem => api.post('/inventoryitem', newItem)]},

    },

    inventoryitem: {

        // actions: {
        //     setAvailableQuantity: (inventoryitem) => [withKeysForUpdate(inventoryitem, ['availableQuantity']), updatedItem => api.put('/inventoryitem', updatedItem)],
        //     setVariety: (inventoryitem) => [withKeysForUpdate(inventoryitem, ['variety']), updatedItem => api.put('/inventoryitem', updatedItem)]
        // },
        
        // inventoryitemvariation: { add: (inventoryitem) => [createChildForEntity(inventoryitem), newItem => api.post('/inventoryitemvariation', newItem)]},

    },

    inventoryitemvariation: {
        
        // actions: {
        //     setAvailableQuantity: (inventoryitemvariation) => [withKeysForUpdate(inventoryitemvariation, ['availableQuantity']), updatedItem => api.put('/inventoryitemvariation', updatedItem)]
        // }
        
    },

    order: { 
        
        // actions: {
        //     setConfirmed: (order) => [withKeysForUpdate(order, ['confirmed']), updatedItem => api.put('/order', updatedItem)],
        //     setShipped: (order) => [withKeysForUpdate(order, ['shipped']), updatedItem => api.put('/order', updatedItem)],
        //     setShippingMethod: (order) => [withKeysForUpdate(order, ['shippingMethod']), updatedItem => api.put('/order', updatedItem)],
        //     setTrackingCode: (order) => [withKeysForUpdate(order, ['trackingCode']), updatedItem => api.put('/order', updatedItem)]
        // }

    },

}

export default {

    actionsForItem: (item, type) => {
        const specializedTypeName = (type.specializationKey && item[type.specializationKey]) || type.name
        return actions[specializedTypeName]
    },

    actionsForType: (typeName) => {
        return actions[typeName]
    },

    actions: actions
}
