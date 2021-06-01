const fetch = require('node-fetch');
const readline = require('readline-sync');

main();
async function main () {

    const userPostcode = getPostCode();
    
    const coordinates = await getCoordinates(userPostcode);
    const busStops = await getNearestBusStops(coordinates);
    if (busStops.length===0) {
        console.log(`There are no bus stops around this location: ${userPostcode}`);
        return;
    }
    for (stop of busStops) {
        await getBuses(stop['naptanId'])
        .then (data => {
            const topBuses = data
            .sort ((bus1, bus2) => {return bus1['timeToStation']-bus2['timeToStation']})
            .slice(0,5);
            if (topBuses.length === 0) {
                console.log(`There are no buses coming to the ${stop.indicator} ${stop.commonName}`);
            }
            else {
                printBuses(topBuses);
            }
        });
    }
    
    if (needDirection()) {
        busStops.forEach (async busStop => {
            const instructions = await getDirectionToStop(userPostcode, busStop) 
            printDirections(busStop, instructions);
        });
    }
    else console.log('Ok')
}  

function getPostCode () {
    console.log('Please enter your postcode:'); 
    const postcode = readline.prompt(); 
    return postcode;  
}

function needDirection() {
    console.log(`Do you want to see directions to your stops?\n Yes/No`);
    let directionNeeded = readline.prompt();
    while ((directionNeeded!== 'Yes') && (directionNeeded!== 'No')) {
        console.log(`You answer was ${directionNeeded}. Please try again. \n`);
        console.log(`Do you want to see directions to your stops?\n Yes/No`);
        directionNeeded = readline.prompt();
    }
    if (directionNeeded==='Yes') return true;   
    else return false;
}

async function getCoordinates (postcode) {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(data => {
        return data.json()
    }); 
       
    while (response["error"] == "Invalid postcode") {
        console.log(`Error: ${response["error"]}. Please try again. \n The postcode you entered was: "${postcode}".`)
        return await getCoordinates(getPostCode());
    }

    return [response["result"]["latitude"], response["result"]["longitude"]];  
}

async function getNearestBusStops (coordinates) {
    const lat = coordinates[0];
    const lon = coordinates[1];
    const busStops = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram&radius=1000`)
        .then (data => data.json())
        .then (data => data['stopPoints']
            .filter(a => a.modes.includes('bus'))
            .slice(0, 2));
    return busStops;    
}

async function getBuses(busStopNaptanId) {
        const buses = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopNaptanId}/Arrivals`)
        .then(data => data.json());
    
    return buses;
}

function printBuses (topBuses) {
    topBuses.forEach(busObj => {
        console.log("----------------")
        console.log(`Bus stop ${busObj["platformName"]} ${busObj["stationName"]}: `);
        console.log(`Bus number: ${busObj["lineId"]}`);
        console.log(`Time to wait: ${parseInt(busObj["timeToStation"]/60)} min ${busObj["timeToStation"]%60} seconds`)
        console.log(`Direction: ${busObj["towards"]}`)
    })
}

async function getDirectionToStop(userPostcode, busStop) {
    const instructions = await fetch(`https://api.tfl.gov.uk/Journey/JourneyResults/${userPostcode}/to/${busStop.naptanId}`)
        .then (data => data.json())
        .then (data => data)
        return instructions;
        
}

function printDirections(busStop, instructions) {
    const instr = instructions.journeys[0].legs[0];
    console.log(`${instr.instruction.summary} ${busStop.indicator} from ${instructions.journeyVector.from}: `);
    const steps = instr.instruction.steps;
    let finalInstructions = [];
    steps.forEach((step) => {
        finalInstructions.push(`${step.descriptionHeading} ${step.description}`);
    })    
    console.log(finalInstructions.join(', ').replace("  ", " "));
}
//EH11 4PB
// DA3 7PE
