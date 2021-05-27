const fetch = require('node-fetch');
const read = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});



//user input = something
const code = '';

read.question(`Please enter your bus stop code: `, code => {
    readAPI(code);
    read.close();
    })

// function readAPI (code) {
//     fetch(`https://api.tfl.gov.uk/StopPoint/490008660N/Arrivals`)
//         .then(response => response.json())
//         .then(body => sortBusesByArrival(body));
// };

function readAPI (code) {
    const output = await fetch(`https://api.tfl.gov.uk/StopPoint/${code}/Arrivals`)
        .then(response => response.json())
        .then(body => sortBusesByArrival(body));
};
    


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