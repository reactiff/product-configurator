import LocationApi from './Location'
import Config from './Config'
import Entity from './Entity'
import Mpg from '../components/mpg/Mpg'

const http = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
}

var prevRequest = null

var cache = {}
var cacheCallbacks = {}

function getResponse(method, url, body, resolve, reject){

    return new Promise(async (cacheResolve, cacheReject) => {
    
        const newRequest = {
            time: Date.now(),
            hash: method + '-' + url,
            body: body,
        }

        if(prevRequest){
            const timeDiff = newRequest.time - prevRequest.time
            if(newRequest.hash === prevRequest.hash && timeDiff < 1000){

                const prevBody = prevRequest.body || {};
                const newBody = newRequest.body || {};

                const str1 = JSON.stringify(prevBody);
                const str2 = JSON.stringify(newBody);

                if(str1 === str2){
                    throw new Error('Duplicate api call within ' + timeDiff + ' milliseconds: ' + newRequest.hash)
                }
                
            }
        }

        prevRequest = newRequest

        //Mpg.logger.log(method + ': ' + Config.url.api + url);

        const response = await fetch(Config.url.api + url,{ 
            method: method, 
            headers: { 
                'Accept': 'application/json, text/plain, *.*',
                'Content-Type': 'application/json'
            },
            body: body && JSON.stringify(body) 
        })

        const actualResolve = resolve || cacheResolve
        const actualReject = reject || cacheReject
        
        if (!response.ok) { 
            actualReject(response); 
            return; 
        }

        const json = await response.json();

        if(!json.hasOwnProperty('ok')){
            actualReject({ok: false, message: 'Invalid json response (ok field is missing)'})
        }

        if(!json.ok){
            actualReject(json)
            return
        }

        switch(method){
            case 'POST':
            case 'PUT':
            case 'PATCH':
            case 'DELETE':
                api.clearCache()
                break;
            default: 
                break;
        }

        actualResolve(json)
    })

}

const api = {

    Entity: Entity, 
    
    login: (email, password, role) => {
        return new Promise(async (resolve, reject) => {

            const handleSuccess = ({data}) => {

                if(data){
                    const identity = data

                    if(identity.related.roles.length === 0 || identity.related.profiles.length === 0){
                        reject({message: 'Please register again'}) 
                        return 
                    }

                    identity.roles = {}
                    identity.related.roles.map(role => identity.roles[role.role.toLowerCase()] = role)
                    identity.role = identity.related.roles[0].role.toLowerCase()
    
                    identity.profiles = {}
                    identity.related.profiles.map(profile => identity.profiles[profile.role.toLowerCase()] = profile)
                    identity.profile = identity.profiles[identity.role.toLowerCase()]
    
                    resolve(identity)

                    return 
                }

                reject({message: 'Could not log in'})
            }

            getResponse(http.POST, '/login', { email: email, password: password }, handleSuccess, reject) 
        })
    },

    //for now, whenever we add or change things, simply clear it
    clearCache: () => {
        cache = {}
    },

    getCachedUrl: (url, reload) => {

        return new Promise(async (resolve, reject) => {

            // only one request should go through, others will be called back
            if(cache.hasOwnProperty(url) && !reload){
                if(cache[url] !== null){
                    resolve(cache[url])
                    return
                }
                else{
                    if(!cacheCallbacks.hasOwnProperty(url)){
                        cacheCallbacks[url] = []
                    }
                    cacheCallbacks[url].push({resolve: resolve, reject: reject})
                    return
                }
            }

            //prepare slot, this is the flag for others that this call is pending
            cache[url] = null

            getResponse(http.GET, url)
                .then(response => {

                    cache[url] = response

                    //cache each result by its ID as well
                    if(response.ok && response.data){
                        if(Array.isArray(response.data)){
                            response.data.forEach(item => cache[item.id] = {ok: true, data: item})
                        }
                        else{
                            cache[response.data.id] = { ok: true, data: response.data }
                        }
                    }

                    resolve(response)
                    if(cacheCallbacks[url]){
                        cacheCallbacks[url].map(pending => pending.resolve(response)) 
                        cacheCallbacks[url] = []
                    }
                })
                .catch(reason => {
                    reject(reason)
                    if(cacheCallbacks[url]){
                        cacheCallbacks[url].map(pending => pending.reject(reason)) 
                        cacheCallbacks[url] = []
                    }
                })

            
        })
    },

    getCachedItem: (entityType, id, reload) => {

        return new Promise(async (resolve, reject) => {

            // Only the first request should go the server
            // Interim requests should be stored and called back when the data is received
            if(cache.hasOwnProperty(id) && !reload){
                if(cache[id] !== null){
                    if(cache[id].data.entityType === entityType){
                        resolve(cache[id])
                    }
                    return
                }
                else{
                    if(!cacheCallbacks.hasOwnProperty(id)){
                        cacheCallbacks[id] = []
                    }
                    cacheCallbacks[id].push({resolve: resolve, reject: reject})
                    return
                }
            }

            //prepare slot, this is the flag for others that this call is pending
            cache[id] = null

            getResponse(http.GET, '/' + entityType + '/' + id)
                .then(item => {
                    cache[id] = item
                    resolve(item)
                    if(cacheCallbacks[id]){
                        cacheCallbacks[id].map(pending => pending.resolve(item)) 
                        cacheCallbacks[id] = []
                    }
                })
                .catch(reason => {
                    reject(reason)
                    if(cacheCallbacks[id]){
                        cacheCallbacks[id].map(pending => pending.reject(reason)) 
                        cacheCallbacks[id] = []
                    }
                })

            
        })
    },
    
    action: (entityOrType, action, data) => {

        return new Promise(async (resolve, reject) => {

            let typeName, item 

            if(typeof entityOrType === 'string'){
                typeName = entityOrType
            }
            else if(entityOrType instanceof Entity){
                typeName = entityOrType.type
                item = entityOrType.item
            }
            else{
                typeName = entityOrType.entityType
                item = entityOrType
            }

            let T = await api.getType(typeName)
            if(T.specializationKey && item){
                typeName = item[T.specializationKey]
            }

            const url = '/' + typeName + '/' + action
            
            const body = data || {}
            if(item){
                body.id = item.id
            }
            
            getResponse(http.PATCH, url, body, resolve, reject) 
        })
    },
    
    set: async (item, key, value) => {

        const entityType = item.entityType || item.type

        const url = '/set/' + entityType
        const body = {
            id: item.id,
            key: key,
            value: value
        }
        
        const response = await fetch(Config.url.api + url, { 
            method: http.PUT, 
            headers: { 
                'Accept': 'application/json, text/plain, *.*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        })
        .catch(reason => {
            return { ok: false, message: reason.message }
        })

        if (!response.ok) { 
            return { ok: false, message: response.statusText || response.message }
        }

        const json = await response.json();

        if(!json.hasOwnProperty('ok')){
            return { ok: false, message: 'Unknown error.  Please try again.' }
        }

        if(!json.ok){
            return json
        }

        const newProps = {}
        newProps[key] = value

        api.clearCache() // CLEAR CACHE

        return { ok: true, data: newProps }
        
    },

    get: (url) => {
        return new Promise(async (resolve, reject) => {
            getResponse(http.GET, url, null, resolve, reject) 
        })
    },

    post: (url, body) => {
        return new Promise(async (resolve, reject) => {
            getResponse(http.POST, url, body, resolve, reject) 
        })
    },

    put: (url, body) => {
        return new Promise(async (resolve, reject) => {
            getResponse(http.PUT, url, body, resolve, reject)         
        })
    },

    delete: (item) => {
        return new Promise(async (resolve, reject) => {

            if(!window.confirm('Are you sure you want to permanently delete this?')){
                resolve({ok: false})
                return 
            }

            const entityType = item.entityType || item.type
            const url = '/' + entityType + '/' + item.id

            getResponse(http.DELETE, url, null, resolve, reject) 
        })
    },

    multipart: (url, body) => {
        return new Promise(async (resolve, reject) => {

            const response = await fetch(Config.url.api + url,{ 
                method: http.POST, 
                // headers: { 
                //     'Accept': 'application/json, text/plain, *.*',
                //     'Content-Type': 'application/json'
                // },
                body: body
            }).catch(reason => {

                console.log(reason)

            })
    
            if (!response.ok) { 
                reject(response); 
                return; 
            }
    
            const json = await response.json();
    
            if(!json.hasOwnProperty('ok')){
                reject({ok: false, message: 'Invalid json response (ok field is missing)'})
            }
    
            if(!json.ok){
                reject(json)
                return
            }
    
            resolve(json)

        })
    },

    getType: (name, specialization) => {
        return new Promise(async (resolve, reject) => {


            const specializedTypeName = name + (specialization ? '/' + specialization : '')

            // only one request should go through, others will be called back
            if(cache.hasOwnProperty(specializedTypeName)){
                if(cache[specializedTypeName] !== null){
                    resolve(cache[specializedTypeName])
                    return
                }
                else{
                    if(!cacheCallbacks.hasOwnProperty(specializedTypeName)){
                        cacheCallbacks[specializedTypeName] = []
                    }
                    cacheCallbacks[specializedTypeName].push({resolve: resolve, reject: reject})
                    return
                }
            }

            //prepare slot, this is the flag for others that this call is pending
            cache[specializedTypeName] = null

            getResponse(http.GET, '/types/' + name)
                .then(json => {
                                        
                    let t = json.data
                    if(specialization){
                        if(!t.specializedTypes[specialization]){
                            throw new Error(name + ' type does not have specialized subtype ' + specialization)
                        }

                        t.fields = t.specializedTypes[specialization]
                    }

                    //call this when ready to resolve all
                    const cacheAndResolve = (resolvedType) => {
                        cache[specializedTypeName] = resolvedType
                        resolve(resolvedType)
                        if(cacheCallbacks[specializedTypeName]){
                            cacheCallbacks[specializedTypeName].map(pending => pending.resolve(t)) 
                            cacheCallbacks[specializedTypeName] = []
                        }
                    }
                    
                    //see if any fields are of reference type
                    // const referenceTypes = Object.keys(t.fields)
                    //     .filter(key => t.fields[key].type==='reference')
                    //     .map(key => ({name: t.fields[key].name, plural: t.fields[key].plural}) )

                    const referenceTypes = []

                    if(referenceTypes.length>0){

                        Promise.all(
                            referenceTypes.map(refType => getResponse(http.GET, '/' + refType.plural))
                        ).then(results => {
                            
                            for(let i=0; i<referenceTypes.length; i++){
                                const fieldName = referenceTypes[i].name
                                t.fields[fieldName].options = results[i].data
                            }

                            cacheAndResolve(t)
                            
                        })

                    }
                    else{
                        cacheAndResolve(t)
                    }
                    
                })
                .catch(reason => {
                    delete cache[specializedTypeName]
                    reject(reason)
                    if(cacheCallbacks[specializedTypeName]){
                        cacheCallbacks[specializedTypeName].map(pending => pending.reject(reason)) 
                        cacheCallbacks[specializedTypeName] = []
                    }
                })

            
        })
    },
    
    // actionsForItem: Actions.actionsForItem,
    // actionsForType: Actions.actionsForType,
    // relationshipsForItem: Relationships.relationshipsForItem,

    role: {
        admin: {},
        teacher: {},
        student: {},
        visitor: {},
    },

    resolveRole: (role) => {
        if(!role){
            return
        }
        let resolvedRole
        switch(role.trim().toLowerCase()){
            case 'admin':
            case 'owner':
            case 'franchiseowner':
                resolvedRole = 'admin'
                break  
            default:
                resolvedRole = role.trim().toLowerCase()
        }
        return resolvedRole
    },

    actionsForItem: (role, item, type) => {
        let resolvedRole = api.resolveRole(role)
        return api.role[resolvedRole].actions.actionsForItem(item, type)
    },
    
    actionsForType: (role, type) => {
        let resolvedRole = api.resolveRole(role)
        return api.role[resolvedRole].actions.actionsForType(type)
    },

    relationshipsForItem: (role, item, type) => {
        const resolvedRole = api.resolveRole(role)
        const roleModule = api.role[resolvedRole]
        const relationships = roleModule.relationships
        return relationships.relationshipsForItem(item, type)
    },

    location: LocationApi,

    createParameterizedUrl: (type, params, parentEntity) => {

        const path = ['/' + type.plural]
        const query = []

        let suppresPk = false
        if(params){
            const keys = Object.keys(params)
            for(let key of keys){
                if(params.hasOwnProperty('partitionKey')){
                    suppresPk = true
                }
                if(params[key]!==null){
                    query.push(key + '=' + params[key])
                }
            }
        }

        if(parentEntity && !suppresPk){
            query.push('partitionKey=' + parentEntity.id)
        }

        if(query.length){
            path.push('/q?')
        }


        return path.join('') + query.join('&')
    }

}

async function loadModules() {

    import('./api/admin/Actions').then(m => api.role.admin.actions = m.default)
    import('./api/admin/Relationships').then(m => api.role.admin.relationships = m.default)

    import('./api/teacher/Actions').then(m => api.role.teacher.actions = m.default)
    import('./api/teacher/Relationships').then(m => api.role.teacher.relationships = m.default)

    import('./api/student/Actions').then(m => api.role.student.actions = m.default)
    import('./api/student/Relationships').then(m => api.role.student.relationships = m.default)

    import('./api/visitor/Actions').then(m => api.role.visitor.actions = m.default)
    import('./api/visitor/Relationships').then(m => api.role.visitor.relationships = m.default)

}
loadModules()



export default api