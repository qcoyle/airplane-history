import * as flightradar from "./render-flightradar.js"

const url = 'https://api.flightradar24.com/common/v1/flight/list.json';
const inputAirline = document.querySelector('#airline');
const inputFlightNumber = document.querySelector('#flight-number');
const submitButton = document.querySelector('#submit');
let radioButtons = document.querySelector('div[id="radio-buttons');

// AJAX functions
const getFlightInfo = async() => {
    let airline = getAirline(document)
    const flightNumber = inputFlightNumber.value;
    console.log(flightNumber);
    if (airline = null) {
        window.alert("Please select an airline");
    } else if (flightNumber === "") {
        window.alert("Please select a flight number");
    } else {
        try {
            await flightradar.render(url + "?&fetchBy=flight&page=1&limit=20&query=" + airline + flightNumber); // airline + flightNumber);

        } catch (error) {
            console.log(error);
        }
    }
}

// Clear page and call AJAX functions
const displayFlightInfo = (event) => {
    event.preventDefault();
    getFlightInfo();
}

submitButton.addEventListener("click", displayFlightInfo);

const getAirline = document => {
    let airlineCode;

    if (document.querySelector("input[id='Alaska']").checked) {
        airlineCode = "AS";
    } else if (document.querySelector("input[id='American']").checked) {
        airlineCode = "AA";
    } else if (document.querySelector("input[id='Delta']").checked) {
        airlineCode = "DL";
    } else if (document.querySelector("input[id='Frontier']").checked) {
        airlineCode = "F9";
    } else if (document.querySelector("input[id='Southwest']").checked) {
        airlineCode = "WN";
    } else if (document.querySelector("input[id='Spirit']").checked) {
        airlineCode = "NK";
    } else if (document.querySelector("input[id='United']").checked) {
        airlineCode = "UA";
    } else if (document.querySelector("input[id='other-airline']").checked) {
        window.alert("Other airline!")
    } else {
        window.alert("Please select an airline");
    }
    return airlineCode;
}