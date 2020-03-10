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
