//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
//import { initializeApp } from "firebase/app";
//import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
//import { initializeApp } from "firebase/app";

// 1. Get the initialization tool from the "app" link
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// 2. Get the database tools from the "firestore" link
import {
    getFirestore,
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ... your config and initialization code
const firebaseConfig = {
    // Copy this from Project Settings > General > Your Apps
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional

    apiKey: "AIzaSyBCNMm6ACaTtIEaPojz0bWJMaTGLlVcxYg",
    authDomain: "fashycards.firebaseapp.com",
    projectId: "fashycards",
    storageBucket: "fashycards.firebasestorage.app",
    messagingSenderId: "278464153936",
    appId: "1:278464153936:web:553d7c311f5ea5dea6c455",
    measurementId: "G-C9ZYF15071"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // This 'db' instance is what you'll use for all calls

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
        console.log("Database object:", db);

        // 1. Fetch from Firestore
        const querySnapshot = await getDocs(collection(db, "words"));

        // 2. Clear current list and fill with Firestore data
        state.flashCards = [];
        querySnapshot.forEach((doc) => {
            // Combines the Firestore ID with the 'front' and 'back' data
            state.flashCards.push({ id: doc.id, ...doc.data() });
        });

        console.log("Cards loaded into state:", state.flashCards.length);

        // 3. Update the UI 
        // IMPORTANT: render() must come BEFORE return
        render();

        // 4. Optionally return the data if you need it elsewhere
        return state.flashCards;

    } catch (error) {
        // Updated the error message to be more accurate for Firebase
        console.error("Firebase Fetch Error:", error);
    }
}

/*async function fetchJsonData() {
    try {
        // 1. Wait for the fetch request to complete
        //const response = await fetch('./cards.json');
        console.log("Database object:", db);
        const querySnapshot = await getDocs(collection(db, "words"));


        // 2. Check if the file exists and is accessible

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 3. Use await to parse the JSON
        //const data = await response.json()
        //state.flashCards = data;
        //state.isLoading = false;

        state.flashCards = [];

        querySnapshot.forEach((doc) => {
            // doc.data() is the object containing 'front', 'back', 'difficulty', etc.
            state.flashCards.push({ id: doc.id, ...doc.data() });
        });

        //return state.flashCards;
        // 4. Draw the first card once data is ready

        render();



    } catch (error) {
        // Handle network errors or JSON syntax errors
        console.error("Could not fetch the JSON file:", error);
    }
}
*/
//The "Renderer" (The only place that touches the DOM)
function render() {
    // 1.set the 'currentCard variable to the first flash card from the json file
    const currentCard = state.flashCards[state.currentIndex];

    // 2. Check if the current card has a value otherwise return 
    if (!currentCard) return;

    // 3. Update text based on flip state
    flashCard.textContent = state.isFlipped ? currentCard.back : currentCard.front;
    debugState();

    // Toggle a CSS class for the animation
    //cardEl.classList.toggle('flipped', state.isFlipped);
}


// 5. Event Listeners
nextBtn.addEventListener('click', () => {
    state.currentIndex = (state.currentIndex + 1) % state.flashCards.length;
    state.isFlipped = false; // Reset flip on next card
    render();
});

flipBtn.addEventListener('click', () => {
    state.isFlipped = !state.isFlipped;
    render();
});


//Adding in a Degbug function to check if the data is being fetched correctly

const DEBUG_MODE = true; // Turn this to false when you're done!

function debugState(action) {
    if (!DEBUG_MODE) return;

    console.group(`%cDebug: ${action}`, "color: #007bff; font-weight: bold;");
    console.log("Current Index:", state.currentIndex);
    console.log("Is Flipped:", state.isFlipped);
    console.log("Total Cards:", state.flashCards.length);
    console.log("Full State Object:", { ...state }); // The { ... } creates a snapshot
    console.groupEnd();
}

// Execute the function
fetchJsonData();
