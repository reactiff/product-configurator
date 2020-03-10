import {useState, useEffect} from 'react'
import api from '../shared/Api'

export default (entityType, id) => {

    const [entity, setEntity] = useState(null)
    const [error, setError] = useState(null)

    const loadEntity = (reload) => {
        api.getCachedItem(entityType, id, reload)
            .then(result => { 
                setEntity(api.Entity.fromItem(result.data))
            }
        ).catch(err => 
            setError(err)
        )
    }
    
    const updateEntity = async (newProps) => {
        if(!newProps){
            loadEntity(true)
        }
        else{
            const newItem = {}
            Object.assign(newItem, entity.item)
            Object.assign(newItem, newProps)
            setEntity(api.Entity.fromItem(newItem))
        }
    }

    useEffect(() => { 
        loadEntity()
    }, [id]);

    return {
        error: error,
        entity: entity,
        update: updateEntity,
    }

}

    