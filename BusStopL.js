const fetch = require('node-fetch');
const readline = require('readline-sync');

main();
async function main () {

    const userPostcode = getPostCode();
    const coordinates = await getCoordinates(userPostcode);
    //console.log(coordinates);
    const busStops = await getNearestBusStops(coordinates);

    for (let stop of busStops) {
        const buses = await getBuses(stop['naptanId']);
        console.log(stop['naptanId']);
        console.log(buses);
    }
    
    //console.log(busStops);

}

function getPostCode () {
    console.log('Please enter your postcode');
    return readline.prompt();    
}

async function getCoordinates (postcode) {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(data => {
        return data.json()});
    //console.log(response);
    return [response["result"]["latitude"], response["result"]["longitude"]];
    
}

async function getNearestBusStops (coordinates) {
    const lat = coordinates[0];
    const lon = coordinates[1];
    const busStops = await fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram`)
    .then (data => data.json())
    .then (data => data['stopPoints'].slice(0, 2));
    //.then (data => console.log(data));
    return busStops;
}

async function getBuses(busStopNaptanId) {
    const buses = await fetch(`https://api.tfl.gov.uk/StopPoint/${busStopNaptanId}/Arrivals`)
        .then(data => data.json());
    return buses;

}
//     .then(response => response.json())
//     .then(body => getCloseBusStops(body))
// }

// //Array.isArdata ray(body)


// let closeBusStops = [];
// function getCloseBusStops (body) {
//     // console.log(body);
//     // console.log(body.length);
//     let final;
//     final = body.stopPoints.sort((stop1, stop2) => {
//         return stop1.distance - stop2.distance;
//         // console.log(obj["naptanId"]);
//         // console.log(obj["distance"]);

//     }).slice(0,2);
//     final.forEach(function (obj) {
//         closeBusStops.push(obj["stationNaptan"])
//     });

//     return final;
// }
// console.log("outer closeBusStops: " + closeBusStops)



// //https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram

// // function readAPI (code) {
// //     fetch(`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals`)
// //         .then(response => response.json())
// //         .then(body => sortBusesByArrival(body));
// // };


    

// function sortBusesByArrival (body) {
//     let buses = body.sort((bus1, bus2) => {
//         return bus1["timeToStation"] - bus2["timeToStation"];
        
//     })
//     //console.log(buses);
//     printResults(buses);
// }


// function printResults(body) {
//     let small = (5 < body.length) ? 5 : body.length;

//     for (let i=0; i<small; i++) {

//         console.log('bus number: ' + body[i]["lineId"]);
//         console.log('time to arrival: ' + body[i]["timeToStation"]);
//         console.log('destination: ' + body[i]["towards"]);
//     }
// }



// //490008660N
// //NaptanPublicBusCoachTram