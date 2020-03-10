const env = 'PROD'  //DEV or PROD

const config = {

    url: {
        cdn: "https://royalstage.blob.core.windows.net"
    },

    slotIntervalMinutes: 30,

    geocodingApi: {

        url: 'https://public.opendatasoft.com/api/records/1.0/search//?dataset=us-zip-code-latitude-and-longitude&rows=1&q=',
        path: {
            latitude: 'records[0].fields.latitude',
            longitude: 'records[0].fields.longitude'
        }
    
    },

    env: env,
    
}

if(env === 'DEV') {
    config.url.api = ''
    config.url.ws = 'ws://192.168.1.174:3001'
} 
else {
    config.url.api = 'https://rss-api.azurewebsites.net/api'     
    // PROD
    config.url.ws = 'ws://rss-api.azurewebsites.net'
}

export default config