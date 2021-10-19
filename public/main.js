import * as flightradar from "./render-flightradar.js"

const url = 'https://api.flightradar24.com/common/v1/flight/list.json';
const inputAirline = document.querySelector('#airline');
const inputFlightNumber = document.querySelector('#flight-number');
const submitButton = document.querySelector('#submit');

// AJAX functions
const getFlightInfo = async() => {
    const airline = inputAirline.value;
    const flightNumber = inputFlightNumber.value;
    try {
        await flightradar.render(url + "?&fetchBy=flight&page=1&limit=20&query=" + airline + flightNumber); // airline + flightNumber);

    } catch (error) {
        console.log(error);
    }
}

function deleteChild() {
    var e = document.querySelector("#responses");

    console.log(e.lastElementChild);
    //e.firstElementChild can be used.
    var child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
        console.log(child);
    }
}

// Clear page and call AJAX functions
const displayFlightInfo = (event) => {
    event.preventDefault();
    // deleteChild();
    getFlightInfo();
}

submitButton.addEventListener("click", displayFlightInfo);