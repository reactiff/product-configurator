import React from 'react'

import Mpg from './Mpg'

// METADATA
const $class = "mpg-portal-inspector"
const $description = 'Its a development tool, for inspecting data on the page'
const $params = {
  id: { type: 'string', description: 'Unique id for this instance in the portal'},
  title: { type:'string', descriptiong: 'Title to be displayed' },
  targetContainer: {type: 'string', description: 'ID of the remote portal'},
  data: { type: 'any', description: 'Data dictionary you want to inspect, must be an object with keys'}
}


export default props => {

  const component = Mpg.PropsParser.parse($class, props, $params)

  const keys = Object.keys(component.data)

  const data = {}

  for(let key of keys) {
    data[key] = <Mpg.Inspector data={component.data[key]} expanded={false} /> 
  }

  return (
    <Mpg.Portal id={props.id} targetContainer={props.targetContainer}>
      <Mpg.Panel>
        <label>{component.title}</label>
        <Mpg.Accordion activeKey={keys[0]}>
          {data}
        </Mpg.Accordion>
      </Mpg.Panel>
    </Mpg.Portal>
  )
}

