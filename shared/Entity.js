import {Inline, DateUtil} from './Util'
import Config from './Config'
import api from './Api'

import validate from './Validate'
import format from './Format'

class Entity {

    constructor(type, item, options){
        this.type = type
        this.item = item
        this.options = options
        this.ref = {}
        this.isEntity = true
    }

    static validate(entityType, entity) {
        return new Promise(async (resolve, reject) => {
            let validationType = null 
            if(typeof entityType === 'string'){
                validationType = await api.getType(entityType)
            }
            else{
                validationType = entityType
            }
            const fields = validationType.fields || validationType
            for(let key in fields){
                if(fields[key].required){
                    if(typeof entity[key] === 'undefined' || entity[key].toString().length === 0){
                        reject({
                            message: key.camelToSentenceCase() + ' is required',
                            field: fields[key]
                        })
                        return
                    }
                    if(fields[key].type === 'tel'){
                        if(!validate.phone(entity[key])){
                            reject({
                                message: key.camelToSentenceCase() + ' is invalid',
                                field: fields[key]
                            })
                            return
                        } 
                    }
                }
            }
            resolve()
        })
    }

    static async format(entityType, entity) {
        let validationType = null 
        if(typeof entityType === 'string'){
            validationType = await api.getType(entityType)
        }
        else{
            validationType = entityType
        }
        const fields = validationType.fields || validationType
        for(let key in fields){
            if(fields[key].type === 'tel'){
                if(entity[key]){
                    entity[key] = format.phone(entity[key])
                }
            }
        }
    }

    static fromItem(item, options){
        return new Entity(item.entityType, item, options)
    }

    static fromArray(arr, options){
        return arr.map(item => new Entity(item.entityType, item, options));
    }

    isOwnedBy(identity) {

        if(!identity || !identity.user){
            return false
        }
        
        if(identity.roles.sysadmin){
            return true
        }

        if(
            this.item.id === identity.user.id || 
            this.item.partitionKey === identity.user.id || 
            this.item.parentId === identity.user.id || 
            this.item.userId === identity.user.id){
            return true
        }

        return false
    }

    get partition() {
        return this.item.partitionKey;
    } 
    get id() {
        return this.item.id;
    } 
    get parentType() {
        return this.item.parentType;
    } 
    get parentId() {
        return this.item.parentId;
    } 
    get parentPartition() {
        return this.item.parentPartition;
    } 
    get hasImages() {
        return this.item.hasImages;
    } 

    toString() {
        if(this.options && this.options.toString){
            return this.options.toString(this.item)
        }
        else{
            return this.getName() || this.item.name || this.type
        }
    }

    getName() {

        const x = this.item

        return Inline.switch(this.type,

            () => x.name || x.title || this.item.firstName + ' ' + this.item.lastName,  //default

            'user', () => this.item.firstName + ' ' + this.item.lastName,  
            'profile', () => this.item.firstName + ' ' + this.item.lastName,  
            'class', () => this.item.name,
            'scheduleday', () => this.item.type + ', ' + (this.item.date ? this.item.title + ', ' + DateUtil.parseAny(this.item.date).toLocaleDateString() : DateUtil.weekDay[this.item.weekday] + 's')
        )   
    }

    getDescription(maxChars) { 

        const value = Inline.select(
            this.type==='profile', () => this.item.summary && (maxChars ? this.item.summary.substring(0, maxChars) : this.item.summary),  
            this.type==='class', () => this.item.description && (maxChars ? this.item.description.substring(0, maxChars) : this.item.description)
        )

        return value
        
    }

    getOldCdnUrl(folder) {
        return Config.url.cdn + 
                '/entity/' + 
                this.type + '/' + 
                this.partition + '/' + 
                this.item.id + (folder ? '/' + folder : '')
    }

    getCdnUrl(folder) {
        return Config.url.cdn + 
                '/entity/' + 
                this.type + '/' + 
                this.item.id + (folder ? '/' + folder : '')
    }

    getCdnPath(folder) {
        return 'entity/' + this.type + '/' + this.item.id + (folder ? '/' + folder : '')
    }

    getMetadata() {

        const item = {
            partitionKey: this.item.partitionKey,
            id: this.item.id 
        }

        const itemFields = ['name', 'firstName', 'lastName', 'description', 'role']
        
        for(let fld of itemFields){
            if(this.item.hasOwnProperty(fld)){
                item[fld] = this.item[fld]
            }
        }
        
        return {
            type: this.type,
            item: item
        }
    }
}

export default Entity
