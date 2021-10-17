const registrationResponse = document.querySelector('#registrationResponse');
const imageResponse = document.querySelector('#imageResponse');

export const renderSuccess = jsonResponse => {
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

    // Parse out JSON
    let aircraftImages = response.aircraftImages;
    let registration = aircraftImages[0].registration;
    let images = aircraftImages[0].images;
    let imageObject = images.medium[0];
    let imageData = [imageObject.src, imageObject.copyright]

    console.log(response.aircraftImages)
    console.log(imageData);

    // Update DOM
    registrationResponse.innerHTML = `<p>Tail Number: ${registration}</p>`;
    imageResponse.innerHTML = `<p>Your plane:</p><img src=${imageData[0]}>`;
}

export const renderResquestFailure = () => {
    registrationResponse.innerHTML = `Error: Request failed. Flight information might be invalid.`;
}

const renderInvalidResponse = () => {
    registrationResponse.innerHTML = `Error: The request succeeded but the flight could not be found. Flight information might be invalid.`;
}