import * as parse from "./parse-flightradar.js"

export const render = async(url) => {

    // Object of elements we will update
    const DOMElements = {
        airlineResponse: document.querySelector('#airline'),
        originResponse: document.querySelector('#origin'),
        destinationResponse: document.querySelector('#destination'),
        registrationResponse: document.querySelector('#registrationResponse'),
        imageResponse: document.querySelector('#imageResponse'),
        equipmentResponse: document.querySelector('#equipment'),
        flightTimeResponse: document.querySelector("#flightTime"),
        statusResponse: document.querySelector("#status")
    }

    console.log(url);
    const response = await fetch(url);
    console.log(response);
    if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        if (jsonResponse.errors) {
            renderRequestFailure(DOMElements);
        } else {
            renderSuccess(jsonResponse)(DOMElements); // Promise fails
        }
    } else {
        renderRequestFailure(DOMElements); // Bad HTTP response
    }
}

const renderSuccess = jsonResponse => {
    let result = jsonResponse.result;
    let response = result.response;
    console.log(response);

    return function render(elements) {
        renderFlightData(response)(elements);
        renderImageData(response)(elements);
    }
}

const renderRequestFailure = elements => {
    clearElements(elements)
    elements.originResponse.innerHTML = `Error: Request failed. Flight information might be invalid.`;
}

export const renderInvalidResponse = elements => {
    clearElements(elements)
    elements.originResponse.innerHTML = `Error: The request succeeded but the flight could not be found. Flight information might be invalid.`;
}

const clearElements = elements => {
    let DOMResponsesValues = Object.values(elements);
    DOMResponsesValues.forEach(element => {
        element.innerHTML = ""
    });
}

const renderFlightData = response => {
    return function run(elements) {
        const parsedData = parse.flightData(response)(elements);

        // Update DOM
        elements.registrationResponse.innerHTML = `<p>Registration: ${parsedData.airline} ${parsedData.registration}</p>`;
        elements.airlineResponse.innerHTML = `<p>Airline: ${parsedData.airline}</p>`;
        elements.originResponse.innerHTML = `<p>Origin: ${parsedData.scheduledDepart} (local time) at ${parsedData.origin}</p>`;
        elements.destinationResponse.innerHTML = `<p>Destination: ${parsedData.scheduledArrive} (local time) at ${parsedData.destination}</p>`;
        elements.flightTimeResponse.innerHTML = `<p>Flight duration: ${parsedData.flightTime}</p>`
        elements.statusResponse.innerHTML = `<p>Status: <span style="font-family: monospace">${parsedData.status}</span>`
        elements.equipmentResponse.innerHTML = `<p>Plane type: ${parsedData.equipment}</p>`
    }
}

const renderImageData = response => {
    const parsedData = parse.imageData(response)
    return function render(elements) {
        if (parsedData === undefined) {
            elements.imageResponse.innerHTML = `<p>No plane image data found</p>`;
        } else {
            // Update DOM
            elements.imageResponse.innerHTML = `<p>Your plane:</p><img src=${parsedData.image}>`;
            let para = document.createElement("p");
            let node = document.createTextNode(`Photo copyright: ${parsedData.copyright}`);
            para.appendChild(node);
            elements.imageResponse.appendChild(para);
        }
    }
}