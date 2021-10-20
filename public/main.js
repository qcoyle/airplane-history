import * as flightradar from "./render-flightradar.js"
import * as airlines from "./airline-helpers.js"

const url = 'https://api.flightradar24.com/common/v1/flight/list.json';
const inputFlightNumber = document.querySelector('#flight-number');
const submitButton = document.querySelector('#submit');
const otherAirlineButton = document.querySelector("#other-airline");
const airlineButton = document.querySelector("#only-buttons");

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

    // If text is not present. Without this conditional, toggle-ing the radio will keep creating new elements
    if (!document.querySelector("#custom-airline")) {
        airlines.displayOtherAirline(document);
    }
}

const removeDisplayChooseAnotherAirline = event => {
    event.preventDefault();

    // If the text field is present
    if (document.querySelector("#custom-airline"))
        removeOtherAirline(document)
}

const displayFlightInfo = (event) => {
    event.preventDefault();
    getFlightInfo();
}

otherAirlineButton.addEventListener("change", displayChooseAnotherAirline);
submitButton.addEventListener("click", displayFlightInfo);

// This is a hack
airlineButton.addEventListener("change", removeDisplayChooseAnotherAirline);


function removeOtherAirline(document) {
    console.log(document);
    let element = document.getElementById("form");
    console.log(element);
    let child = document.getElementById("custom-airline");
    element.removeChild(child);
}