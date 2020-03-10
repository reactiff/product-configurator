import Config from './Config'

export default {
    

    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::                                                                         :::
    //:::  This routine calculates the distance between two points (given the     :::
    //:::  latitude/longitude of those points). It is being used to calculate     :::
    //:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
    //:::                                                                         :::
    //:::  Definitions:                                                           :::
    //:::    South latitudes are negative, east longitudes are positive           :::
    //:::                                                                         :::
    //:::  Passed to function:                                                    :::
    //:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
    //:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
    //:::    unit = the unit you desire for results                               :::
    //:::           where: 'M' is statute miles (default)                         :::
    //:::                  'K' is kilometers                                      :::
    //:::                  'N' is nautical miles                                  :::
    //:::                                                                         :::
    //:::  Worldwide cities and other features databases with latitude longitude  :::
    //:::  are available at https://www.geodatasource.com                         :::
    //:::                                                                         :::
    //:::  For enquiries, please contact sales@geodatasource.com                  :::
    //:::                                                                         :::
    //:::  Official Web site: https://www.geodatasource.com                       :::
    //:::                                                                         :::
    //:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
    //:::                                                                         :::
    //:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    getDistance(lat1, lon1, lat2, lon2, unit = 'M') {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    },

    getCurrent: () => {

        return new Promise((resolve, reject) => {

            const handleError = (error) => {
                switch(error.code) {
                  case error.PERMISSION_DENIED:
                    resolve({ok: false, code: error.code, codeAnnotation: "PERMISSION_DENIED", message: "User denied the request for Geolocation."}) 
                    break;
                  case error.POSITION_UNAVAILABLE:
                    resolve({ok: false, code: error.code, codeAnnotation: "POSITION_UNAVAILABLE", message: "Location information is unavailable."}) 
                    break;
                  case error.TIMEOUT:
                    resolve({ok: false, code: error.code, codeAnnotation: "TIMEOUT", message: "The request to get user location timed out."}) 
                    break;
                  case error.UNKNOWN_ERROR:
                    resolve({ok: false, code: error.code, codeAnnotation: "UNKNOWN_ERROR", message: "An unknown error occurred."}) 
                    break;
                }
            }

            const handlePosition = (position) => {
                resolve({ok: true, position: position})
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(handlePosition, handleError);
            } else {
                resolve({ok: false, code: null, message: "Geolocation is not supported by this browser."})
            }

        })

        

    },

    getCoordinates: (address) => {
        
        return new Promise(async (resolve, reject) => {

            const response = await fetch(Config.geocodingApi.url + address)
            const json = await response.json();

            if(json.records.length){
                resolve({
                    ok: true,
                    latitude: json.records[0].fields.latitude,
                    longitude: json.records[0].fields.longitude
                })
            }
            else{
                resolve({ok: false, message: 'Address not found'})
            }
            

        })
    }


}