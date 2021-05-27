const fetch = require('node-fetch');
const read = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


// read.question(`Please enter your bus stop code: `, code => {

//     arrivalsReadAPI(code);
//     read.close();
//     })

read.question(`Please enter your post code: `, postcode => {

    getCoordinates(postcode);
    read.close();
    })


function getCoordinates (postcode) {
    fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(response => response.json())
    .then(body => coordinates(body));


}

function coordinates (body) {
    let coordinates = [body["result"]["longitude"], body["result"]["latitude"]];
    nearestBusStopsAPI(coordinates);
}

function nearestBusStopsAPI (coordsArr) {
    const lon = coordsArr[0];
    const lat = coordsArr[1];
    fetch(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram`)
    .then(response => response.json())
    .then(body => closeBusStops(body))
}



function closeBusStops(body) {
    console.log(typeof(body));
    console.log(body.length);
    // body.forEach(function (obj) {
    //     console.log(obj["naptanId"]);
    //     console.log(obj["distance"]);

// })
}

//https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram

// function readAPI (code) {
//     fetch(`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals`)
//         .then(response => response.json())
//         .then(body => sortBusesByArrival(body));
// };

// function arrivalsReadAPI (code) {
//     fetch(`https://api.tfl.gov.uk/StopPoint/${code}/Arrivals`)
//         .then(response => response.json())
//         .then(body => sortBusesByArrival(body));
// };
    

function sortBusesByArrival (body) {
    let buses = body.sort((bus1, bus2) => {
        return bus1["timeToStation"] - bus2["timeToStation"];
        
    })
    //console.log(buses);
    printResults(buses);
}


function printResults(body) {
    let small = (5 < body.length) ? 5 : body.length;

    for (let i=0; i<small; i++) {

        console.log('bus number: ' + body[i]["lineId"]);
        console.log('time to arrival: ' + body[i]["timeToStation"]);
        console.log('destination: ' + body[i]["towards"]);
    }
}



//490008660N
//NaptanPublicBusCoachTram