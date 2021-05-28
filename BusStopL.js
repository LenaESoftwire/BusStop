const fetch = require('node-fetch');
const readline = require('readline-sync');

main();
async function main () {

    const userPostcode = getPostCode();
    const coordinates = await getCoordinates(userPostcode);
    const busStops = await getNearestBusStops(coordinates);
    for (let stop of busStops) {
        await getBuses(stop['naptanId'])
        .then (data => {
            const topBuses = data.slice(0,5)
            printBuses(topBuses)
        });
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
    console.log('Please enter your postcode'); 
    const postcode = readline.prompt(); 
        return postcode;  
}

async function getCoordinates (postcode) {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(data => {
    return data.json()
    }); 
       
    while (response["error"] == "Invalid postcode") {
        console.log(response["error"] + " Try it again. Make sure it is a real postcode.")
        return await getCoordinates(getPostCode());
    }

    return [response["result"]["latitude"], response["result"]["longitude"]];  
}

async function getNearestBusStops (coordinates) {
    const lat = coordinates[0];
    const lon = coordinates[1];
    const busStops = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram`)
    .then (data => data.json())
    .then (data => data['stopPoints'].slice(0, 2));
    return busStops;
}

async function getBuses(busStopNaptanId) {
    const buses = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopNaptanId}/Arrivals`)
        .then(data => data.json());
    return buses;
}


// //490008660N
// //NaptanPublicBusCoachTram