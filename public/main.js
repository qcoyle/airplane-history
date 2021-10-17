import * as flightradar from "./flightradar.js"

const url = 'https://api.flightradar24.com/common/v1/flight/list.json';
const inputAirline = document.querySelector('#airline');
const inputFlightNumber = document.querySelector('#flight-number');
const submitButton = document.querySelector('#submit');

// AJAX functions
const getFlightInfo = async() => {
    const airline = inputAirline.value;
    const flightNumber = inputFlightNumber.value;
    try {
        const response = await fetch(url + "?&fetchBy=flight&page=1&limit=10&query=" + airline + flightNumber); // airline + flightNumber);
        if (response.ok) {
            const jsonResponse = await response.json();
            if (jsonResponse.errors) {
                responseField.innerHTML = `<p>Error: couldn't format response</p>`;
            } else {
                flightradar.renderSuccess(jsonResponse);
            }
        } else {
            flightradar.renderResquestFailure();
        }
    } catch (error) {
        console.log(error);
    }
}

// Clear page and call AJAX functions
const displayFlightInfo = (event) => {
    event.preventDefault();

    getFlightInfo();
}

submitButton.addEventListener("click", displayFlightInfo);