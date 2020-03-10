import React from 'react'
import CodeMirror from 'react-codemirror'

import Mpg from '../Mpg'

import Badge from 'react-bootstrap/Badge'



import '../css/metadata.css'

require('codemirror/lib/codemirror.css');

// require('codemirror/mode/javascript/javascript');
// require('codemirror/mode/xml/xml');
// require('codemirror/mode/markdown/markdown');
require('codemirror/mode/jsx/jsx');

require('codemirror/theme/seti.css');

export default (props) => {

    const params = Object.keys(props.data.params).map((key) => {
        const p = {name: key}
        Object.assign(p, props.data.params[key])
        if(p.options && typeof p.options === 'string'){
            p.options = p.options.split('|')
        }
        return p
    })

    // const selectedParams = paramArray.map(p => {
    //     return key + '={'+p.type+'}' 
    // })

    const getSampleParam = (p) => {

        // if(p.name==='regex'){
        //     debugger
        // }

        let value = ''

        let defaultValue = p.example
        if(typeof defaultValue === 'undefined'){
            defaultValue = p.default
        }
        if(typeof defaultValue === 'undefined'){
            defaultValue = p.defaultValue
        }
         
        let options = p.options
        
        let lq = ''
        let rq = ''

        let equalSign = '='

        //if default value missing
        if(typeof defaultValue === 'undefined' && typeof options === 'undefined'){
            switch(p.type){
                case 'any':
                case 'object':
                    defaultValue = 'object'
                    break;
                case 'function':
                    defaultValue = '() => doSomething()'
                    break;
                case 'boolean':
                    defaultValue = 'true'
                    break;
                default:
                    defaultValue = ''
                    break;
            }
        }
        
        switch(p.type){
            case 'string':
            case 'text':
                lq = rq = '"'
                break;
            case 'boolean':
                if(defaultValue === 'true'){
                    lq = rq = ''
                    defaultValue = ''
                    equalSign = ''
                }
                else{
                    lq = '{'
                    rq = '}'
                }
                
                break;
            default:
                lq = '{'
                rq = '}'
                break;
        }
        
        if(typeof defaultValue !== 'undefined'){
            value = lq + defaultValue + rq + (options ? '//' + options : '')
        }
        else{
            if(options){
                if(Array.isArray(options)){
                    options = options.join('|')
                }
                else if(options.indexOf(',')){
                    options = options.split(',').join('|')
                }
                
                value = lq + options + rq
            }
            else {
                value = lq + '' + rq
            }
        }

        return '\t' + p.name + equalSign + value
    }


    const requiredParams = params.filter(p => p.name!=='data' && p.required)
    let sampleRequiredParams = []
    if(requiredParams.length){
        sampleRequiredParams = ['\t//required'].concat(requiredParams.map(getSampleParam))
    }
    
    const optionalParams = params.filter(p => p.name!=='data' && !p.required)
    let sampleOptionalParams = []
    if(optionalParams.length){
        sampleOptionalParams = ['\t//optional'].concat(optionalParams.map(getSampleParam))
    }
    

    let sampleDataAsChildren = ''
    if(props.data.params.hasOwnProperty('data')){

        let content = props.data.params.data.example
        if(typeof content === 'undefined'){
            switch(props.data.params.data.type){
                case 'element':
                    content = '<content/>'
                    sampleDataAsChildren = '\t' + content + '\n\n'
                    break;
                default: 
                    sampleDataAsChildren = '\t{ /* data param */\n\t\t' + '{}' + '\n\t}  \n\n'
                    break;
            }
        }
        else{
            sampleDataAsChildren = '\t{ /* data param */\n\t\t' + content + '\n\t}  \n\n'
        }

        
    }

    const attributes = [props.name].concat(sampleRequiredParams).concat(sampleOptionalParams)
    const codeSample = props.data.code || '<Mpg.'+attributes.join('\n')+'\n>\n\n'+sampleDataAsChildren+'</Mpg.'+props.name + '>'

    //determine which columns should be displayed
    const columns = {
        name: true,
        type: true,
        default: params.some(p => typeof p.default !== 'undefined'),
        description: params.some(p => typeof p.description !== 'undefined'),
        example: params.some(p => typeof p.example !== 'undefined'),
        options: params.some(p => typeof p.options !== 'undefined')
    }

    const testcolumns = Object.keys(columns).map((fld, i) => true)
    const testparamsmap = params.map((parameter, index) => true)

    return (
        <>

            {
                props.data.description ? (
                    <Mpg.Panel
                        bgColor="" //asdasd
                    > 
                        {
                            // { key: 0 }
                        }

                        <p>{props.data.description}</p>
                    </Mpg.Panel>
                ) : null
            }

            <Mpg.Panel>
                <strong>CSS Class:</strong> {props.data.class}
            </Mpg.Panel>

            {
                params.length ? (
                    <Mpg.Panel>
                        <table border="1">
                            <thead>
                                <tr>
                                    {/* GENERATE COLULMN HEADERS */}
                                    {
                                        Object.keys(columns).map((fld, i) => {
                                            if(columns[fld]){
                                                return (
                                                    <th key={i}>
                                                        {fld.camelToSentenceCase()}
                                                    </th>
                                                )
                                            }
                                            return null
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    params.map((parameter, index) => {

                                        // const example = params[key].example
                                        // const exampleCode = typeof example === 'string' ? example : Stringify(example)

                                        const content = Object.keys(columns).map((fld, findex) => {

                                            if(columns[fld]){

                                                let value 
                                                
                                                switch(fld) {
                                                    case 'name':
                                                        value = parameter[fld];
                                                        break;
                                                    case 'options':

                                                        if(parameter.options && parameter.options.length){

                                                            value = parameter.options.map((option, oindex) => {

                                                                return (<Badge key={oindex} variant="light">{option}</Badge>)
                                                            })

                                                        }
                                                        break;
                                                        
                                                    default:
                                                        value = parameter[fld];
                                                }
                                                

                                                return (
                                                    <td key={findex} className={"parameter-" + fld}>
                                                        {
                                                            value
                                                        }
                                                    </td>
                                                )

                                            }
                                            return null
                                        })

                                        return (
                                            <tr key={index}>
                                                {
                                                    content
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </Mpg.Panel>
                ) : null
            }
            

            

            <Mpg.Panel>
                <CodeMirror 
                    value={codeSample} 
                    
                    options={
                        {
                            mode: 'jsx', 
                            lineNumbers: true,
                            theme: "seti"
                        }
                    } />
                {/* <pre className="jsx">{codeSample}</pre> */}
            </Mpg.Panel>
        </>
    )

}
    

