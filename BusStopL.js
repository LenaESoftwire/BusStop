const fetch = require('node-fetch');
const readline = require('readline-sync');

main();
async function main () {

    const userPostcode = 'EH11 4PB'; //getPostCode();
    const coordinates = await getCoordinates(userPostcode);
    const busStops = await getNearestBusStops(coordinates);
    if (busStops.length===0) {
        console.log("There are no bus stops around");
    }
    else {
        for (stop of busStops) {
            await getBuses(stop['naptanId'])
            .then (data => {
                const topBuses = data
                .sort ((bus1, bus2) => {return bus1['timeToStation']-bus2['timeToStation']})
                .slice(0,5);
                console.log(topBuses);
                printBuses(topBuses)
            });
        }
        
    }  
}

function printBuses (topBuses) {
    topBuses.forEach(busObj => {
        console.log("----------------")
        console.log("Bus Stop: " + busObj["stationName"] + ", Platform: " + busObj["platformName"]);
        console.log("Bus number: " + busObj["lineId"]);
        console.log("Time to wait: " + busObj["timeToStation"] + " seconds")
        console.log("Direction: " + busObj["towards"])
    })
}

function getPostCode () {
    console.log('Please enter your postcode:'); 
    const postcode = readline.prompt(); 
    return postcode;  
}

async function getCoordinates (postcode) {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(data => {
        return data.json()
    }); 
       
    while (response["error"] == "Invalid postcode") {
        console.log("Error: " + response["error"] + `. Please try again. The postcode you entered was: "${postcode}".`)
        return await getCoordinates(getPostCode());
    }

    return [response["result"]["latitude"], response["result"]["longitude"]];  
}

async function getNearestBusStops (coordinates) {
    const lat = coordinates[0];
    const lon = coordinates[1];
    const busStops = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram`)
        .then (data => data.json())
        .then (data => data['stopPoints'].filter(a => a.stopType==='NaptanPublicBusCoachTram').slice(0, 2));
    console.log(busStops);
    return busStops;
    
}

async function getBuses(busStopNaptanId) {
        const buses = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopNaptanId}/Arrivals`)
        .then(data => data.json());
    
    return buses;
    


}

//EH11 4PB

// 490008660N
// NaptanPublicBusCoachTram
// DA3 7PE
//NW119UA
// 'EH11 4PB';
//