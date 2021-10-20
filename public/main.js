import * as flightradar from "./render-flightradar.js"
import * as airlines from "./airline-helpers.js"

const url = 'https://api.flightradar24.com/common/v1/flight/list.json';
const inputFlightNumber = document.querySelector('#flight-number');
const submitButton = document.querySelector('#submit');
const otherAirlineButton = document.querySelector("#other-airline");

const getFlightInfo = async() => {
    const airline = airlines.getAirline(document)
    const flightNumber = inputFlightNumber.value;
    console.log(flightNumber);
    console.log(airline);
    if (airline === null) {
        window.alert("Please select an airline");
    } else if (flightNumber === "") {
        window.alert("Please select a flight number");
    } else {
        try {
            console.log(airline);
            await flightradar.render(url + "?&fetchBy=flight&page=1&limit=20&query=" + airline + flightNumber); // airline + flightNumber);

        } catch (error) {
            console.log(error);
        }
    }
}

const displayChooseAnotherAirline = event => {
    event.preventDefault();
    if (!document.querySelector("#custom-airline")) {
        airlines.displayOtherAirline(document);
    }
}

const displayFlightInfo = (event) => {
    event.preventDefault();
    getFlightInfo();
}

otherAirlineButton.addEventListener("change", displayChooseAnotherAirline);
submitButton.addEventListener("click", displayFlightInfo);