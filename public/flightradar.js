// NOTE: This module is not used because of CORS errors when calling https://flightaware.com. It appears they don't allow fetch calls to the raw HTML. The solution is signing up for access to their REST API but that requires a credit card

const registrationResponse = document.querySelector('#registrationResponse');
const imageResponse = document.querySelector('#imageResponse');

export const render = async(url) => {
    console.log(url);
    const response = await fetch(url);
    console.log(response);
    if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.errors) {
            responseField.innerHTML = `<p>Error: couldn't format response</p>`;
        } else {
            renderSuccess(jsonResponse);
        }
    } else {
        renderResquestFailure();
    }
}

const renderSuccess = jsonResponse => {
    // // Uncomment to see raw JSON response
    // let structuredResponse = JSON.stringify(jsonResponse).replace(/,/g, ", \n");
    // structuredResponse = `<pre>${structuredResponse}</pre>`;
    // responseField.innerHTML = `<p>Raw JSON response is </p><p> ${structuredResponse} </p>`;

    let result = jsonResponse.result;
    let response = result.response;

    // If request succeeds but no aircraft info returned
    if (response.aircraftInfo === null) {
        renderInvalidResponse();
    }
    parseImageData(response);
}

const renderResquestFailure = () => {
    registrationResponse.innerHTML = `Error: Request failed. Flight information might be invalid.`;
}

const renderInvalidResponse = () => {
    registrationResponse.innerHTML = `Error: The request succeeded but the flight could not be found. Flight information might be invalid.`;
}

const parseImageData = response => {
    // Parse out JSON
    let aircraftImages = response.aircraftImages;
    let registration = aircraftImages[0].registration;
    let images = aircraftImages[0].images;
    let imageObject = images.medium[0];
    let imageData = [registration, imageObject.src, imageObject.copyright]

    console.log(response.aircraftImages)
    console.log(imageData);
    renderImageData(imageData)
}

const renderImageData = imageData => {
    // Update DOM
    registrationResponse.innerHTML = `<p>Your plane's tail Number: ${imageData[0]}</p>`;
    imageResponse.innerHTML = `<p>Your plane:</p><img src=${imageData[1]}>`;
    const para = document.createElement("p");
    const node = document.createTextNode(`Photo copyright: ${imageData[2]}`);
    para.appendChild(node);
    imageResponse.appendChild(para);
}