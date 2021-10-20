export const getAirline = document => {
    let airlineCode;
    let customAirlineElement;

    if (document.querySelector('#custom-airline')) {
        customAirlineElement = document.querySelector('#custom-airline');
        console.log(customAirlineElement.value);
    }

    // This shouldn't be hardcoded...
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

export const displayOtherAirline = document => {
    let parentNode = document.querySelector("#form");
    console.log(parentNode);
    let element = document.querySelector("#flight-number-text");
    let input = document.createElement("input");
    input.type = "text";
    input.className = "col-10";
    input.requiredType = "text";
    input.id = "custom-airline";
    input.placeholder = "Enter airline code (i.e. 'EK' for Emirates)";
    parentNode.insertBefore(input, element);
}