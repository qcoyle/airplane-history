export const render = async(url) => {

    // All elements we will update
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
            renderRequestFailure();
        } else {
            renderSuccess(jsonResponse, DOMElements); // Promise fails
        }
    } else {
        renderRequestFailure(); // Bad HTTP response
    }
}

const renderSuccess = (jsonResponse, elements) => {
    // // Uncomment to see raw JSON response
    // let structuredResponse = JSON.stringify(jsonResponse).replace(/,/g, ", \n");
    // structuredResponse = `<pre>${structuredResponse}</pre>`;
    // responseField.innerHTML = `<p>Raw JSON response is </p><p> ${structuredResponse} </p>`;

    let result = jsonResponse.result;
    let response = result.response;

    console.log(response);
    parseFlightData(response, elements);
    parseImageData(response, elements);
}

const renderRequestFailure = elements => {
    clearElements(elements)
    elements.originResponse.innerHTML = `Error: Request failed. Flight information might be invalid.`;
}

const renderInvalidResponse = elements => {
    clearElements(elements)
    registrationResponse.innerHTML = `Error: The request succeeded but the flight could not be found. Flight information might be invalid.`;
}

const clearElements = elements => {
    let DOMResponsesValues = Object.values(elements);
    DOMResponsesValues.forEach(element => {
        element.innerHTML = ""
    });
}

const parseFlightData = (response, elements) => {
    console.log("Parse flight data");
    let flights = response.data;
    let showFlight; // The flight we'll display info about

    let i = 0;
    // Once we select a flight, stop looping through flights
    while (showFlight === undefined) {
        let flight = flights[i];
        // Find if the flight is live
        let status = flight.status;
        if (status.live === true) {
            showFlight = flight;

            //If flight isn't live, find the next scheduled one
        } else if (status.text.includes("Landed")) {
            showFlight = flights[i - 1];

        }
        i++;
    }

    if (showFlight === undefined) {
        renderInvalidResponse();
        console.log("no flight found");
    }

    console.log(showFlight);
    let originAirport = showFlight.airport.origin;
    let destinationAirport = showFlight.airport.destination;
    let originTimezone = originAirport.timezone.name;
    // let destinationTimeOffset = destinationAirport.timezone.offset;
    let departureTimeRaw = showFlight.time.scheduled.departure;
    let arrivalTimeRaw = showFlight.time.scheduled.arrival;
    let scheduledDepartureTime = new Date(departureTimeRaw * 1000).toLocaleString("en-US", { timeZone: originTimezone });
    let destinationTimezone = destinationAirport.timezone.name;
    let scheduledArrivalTime = new Date(arrivalTimeRaw * 1000).toLocaleString("en-US", { timeZone: destinationTimezone });

    let data = {
        airline: showFlight.airline.name,
        origin: originAirport.name,
        destination: destinationAirport.name,
        registration: showFlight.aircraft.registration,
        equipment: showFlight.aircraft.model.text,
        scheduledDepart: scheduledDepartureTime,
        scheduledArrive: scheduledArrivalTime,
        originTimezone: originTimezone,
        flightTime: new Date((arrivalTimeRaw - departureTimeRaw) * 1000).toISOString().substr(11, 8),
        status: showFlight.status.text
    }

    renderFlightData(data, elements);
}

const parseImageData = (response, elements) => {
    // Parse out JSON
    let aircraftImages = response.aircraftImages;
    let images = aircraftImages[0].images;
    let imageObject = images.medium[0];
    let imageData = {
        image: imageObject.src,
        copyright: imageObject.copyright
    }

    console.log(response.aircraftImages)
    console.log(imageData);
    renderImageData(imageData, elements)
}

// Update DOM
const renderFlightData = (flightData, elements) => {
    elements.registrationResponse.innerHTML = `<p>Registration: ${flightData.airline} ${flightData.registration}</p>`;
    elements.airlineResponse.innerHTML = `<p>Airline: ${flightData.airline}</p>`;
    elements.originResponse.innerHTML = `<p>Origin: ${flightData.scheduledDepart} (local time) at ${flightData.origin}</p>`;
    elements.destinationResponse.innerHTML = `<p>Destination: ${flightData.scheduledArrive} (local time) at ${flightData.destination}</p>`;
    elements.flightTimeResponse.innerHTML = `<p>Flight duration: ${flightData.flightTime}</p>`
    elements.statusResponse.innerHTML = `<p>Status: <span style="font-family: monospace">${flightData.status}</span>`
    elements.equipmentResponse.innerHTML = `<p>Plane type: ${flightData.equipment}</p>`
}

const renderImageData = (imageData, elements) => {
    elements.imageResponse.innerHTML = `<p>Your plane:</p><img src=${imageData.image}>`;
    let para = document.createElement("p");
    let node = document.createTextNode(`Photo copyright: ${imageData.copyright}`);
    para.appendChild(node);
    elements.imageResponse.appendChild(para);
}