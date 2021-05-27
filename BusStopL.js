const fetch = require('node-fetch');
const readline = require('readline-sync');

//const userPostcode = getPostCode();
const data = getAPIFromPostcode(getPostCode());
const userCoordinates = getCoordinates(data);
//console.log(userCoordinates);

function getPostCode () {
    console.log('Please enter your postcode');
    return readline.prompt();
    
}



async function getAPIFromPostcode (postcode) {
    const responce = await fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(response => response.json())
    .then(data => {
        let result = data;
        return result});
    console.log(responce);
    
}
//console.log(getAPIFromPostcode(getPostCode()));

function getCoordinates (body) {
    console.log(body);
    //let coordinates = [body["result"]["longitude"], body["result"]["latitude"]];
    //return coordinates;
    //nearestBusStopsAPI(coordinates);
}

// function nearestBusStopsAPI (coordsArr) {
//     const lon = coordsArr[0];
//     const lat = coordsArr[1];
//     fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram`)
//     .then(response => response.json())
//     .then(body => getCloseBusStops(body))
// }

// //Array.isArray(body)


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

// function arrivalsReadAPI (code) {
//     fetch(`https://api.tfl.gov.uk/StopPoint/${code}/Arrivals`)
//         .then(response => response.json())
//         .then(body => sortBusesByArrival(body));
// };
    

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