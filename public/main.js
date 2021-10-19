import * as flightradar from "./render-flightradar.js"

const url = 'https://api.flightradar24.com/common/v1/flight/list.json';
const inputAirline = document.querySelector('#airline');
const inputFlightNumber = document.querySelector('#flight-number');
const submitButton = document.querySelector('#submit');
const otherAirlineButton = document.querySelector("#other-airline");

const getFlightInfo = async() => {
    const airline = getAirline(document)
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

const displayOtherAirlineHandler = event => {
    event.preventDefault();
    if (!document.querySelector("#custom-airline")) {
        displayOtherAirline(document);
    }
}

const displayFlightInfo = (event) => {
    event.preventDefault();
    getFlightInfo();
}

otherAirlineButton.addEventListener("click", displayOtherAirlineHandler);
submitButton.addEventListener("click", displayFlightInfo);

const getAirline = document => {
    let airlineCode;
    let customAirlineElement;

    if (document.querySelector('#custom-airline')) {
        customAirlineElement = document.querySelector('#custom-airline');
        console.log(customAirlineElement.value);
    }

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
    } else if (!(customAirlineElement.value === "")) {
        airlineCode = customAirlineElement.value;
    } else {
        window.alert("Please select an airline");
    }

    console.log(airlineCode);
    return airlineCode;
}

const displayOtherAirline = document => {
    let element = document.querySelector("#radio-buttons");
    let input = document.createElement("input");
    input.type = "text";
    input.className = "col-12";
    input.requiredType = "text";
    input.id = "custom-airline";
    input.placeholder = "Enter airline code (i.e. 'EK' for Emirates)";
    element.appendChild(input);
}