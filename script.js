//Initialize variables 



//set the front of the flash card to be equal to the current flash card object 
let flashCard = document.querySelector(".front");
let dataFetched;
//function for getting the current set of flashCards fron the 'cards.json' file

let flashCards = [];
console.log('test');


async function fetchJsonData() {
    try {
        // 1. Wait for the fetch request to complete
        const response = await fetch('./cards.json');

        // 2. Check if the file exists and is accessible
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 3. Wait for the data to be parsed into an array/object
        flashCards = await response.json();

        // Now you can use your array
        console.log(flashCards);
        dataFetched = true;
    } catch (error) {
        // Handle network errors or JSON syntax errors
        console.error("Could not fetch the JSON file:", error);
        dataFetched = false;
    }
}

// Execute the function
fetchJsonData();

if (dataFetched === true) {
    flashCard.textContent = flashCards[0];
}