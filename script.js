//Initialize variables 



//set the front of the flash card to be equal to the current flash card object 
const flashCard = document.querySelector(".flashCard .content");
const nextBtn = document.querySelector('.next-btn');
const flipBtn = document.querySelector('.flip-btn');
//function for getting the current set of flashCards fron the 'cards.json' file

//
const state = {
    flashCards: [],
    currentIndex: 0,
    isFlipped: false,
    isLoading: true
};

async function fetchJsonData() {
    try {
        // 1. Wait for the fetch request to complete
        const response = await fetch('./cards.json');

        // 2. Check if the file exists and is accessible

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 3. Use await to parse the JSON
        const data = await response.json()
        state.flashCards = data;
        state.isLoading = false;

        // 4. Draw the first card once data is ready

        render();



    } catch (error) {
        // Handle network errors or JSON syntax errors
        console.error("Could not fetch the JSON file:", error);
    }
}

//The "Renderer" (The only place that touches the DOM)
function render() {
    // 1.set the 'currentCard variable to the first flash card from the json file
    const currentCard = state.flashCards[state.currentIndex];

    // 2. Check if the current card has a value otherwise return 
    if (!currentCard) return;

    // 3. Update text based on flip state
    flashCard.textContent = state.isFlipped ? currentCard.back : currentCard.front;
    console.log(state.flashCards[0]);

    // Toggle a CSS class for the animation
    //cardEl.classList.toggle('flipped', state.isFlipped);
}


// 5. Event Listeners
nextBtn.addEventListener('click', () => {
    state.StateIndex = (state.currentIndex + 1) % state.flashCards.length;
    state.isFlipped = false; // Reset flip on next card
    render();
});

flipBtn.addEventListener('click', () => {
    state.isFlipped = !state.isFlipped;
    render();
});

// Execute the function
fetchJsonData();
