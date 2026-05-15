/**
 * SECTION 1: DATABASE SDK IMPORTS
 * We import specific modules from the Firebase CDN. 
 * 'initializeApp' starts the connection, while 'firestore' modules handle the data.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * SECTION 2: CONFIGURATION
 * Credentials used to authenticate your web app with your specific Firebase Project.
 */
const firebaseConfig = {
    apiKey: "AIzaSyBCNMm6ACaTtIEaPojz0bWJMaTGLlVcxYg",
    authDomain: "fashycards.firebaseapp.com",
    projectId: "fashycards",
    storageBucket: "fashycards.firebasestorage.app",
    messagingSenderId: "278464153936",
    appId: "1:278464153936:web:553d7c311f5ea5dea6c455",
    measurementId: "G-C9ZYF15071"
};

// Initialize Firebase and Database Service
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * SECTION 3: APPLICATION STATE (The Brain)
 * State-driven architecture: This object is the single "Source of Truth" for the app.
 * If the data here changes, we call render() to update the screen.
 */
const state = {
    flashCards: [],    // Array of objects containing card data
    currentIndex: 0,   // Pointer to the card currently being viewed
    isFlipped: false,  // Boolean: true = 'back', false = 'front'
    isLoading: true    // Tracks if we are currently fetching data
};

/**
 * SECTION 4: UI ELEMENTS (DOM CACHING)
 * We select these once and store them in variables to keep the code clean.
 */
const flashCardDisplay = document.querySelector(".flashCard .content");
const nextBtn = document.querySelector('.next-btn');
const flipBtn = document.querySelector('.flip-btn');
const saveBtn = document.querySelector('#save-btn');
const frontInput = document.querySelector('#front-input');
const backInput = document.querySelector('#back-input');

/**
 * SECTION 5: ASYNCHRONOUS LOGIC (The Cloud Dance)
 */

/**
 * Fetches all card data from the 'words' collection in the cloud.
 * @async
 */
async function fetchJsonData() {
    try {
        // Step 1: Request data snapshot from Firestore
        const querySnapshot = await getDocs(collection(db, "words"));

        // Step 2: Clear local array and map cloud data into state
        state.flashCards = [];
        querySnapshot.forEach((doc) => {
            // Using the 'spread operator' (...) to merge ID with card content
            state.flashCards.push({ id: doc.id, ...doc.data() });
        });

        console.log("Cards loaded into state:", state.flashCards.length);

        // Step 3: Draw the first card now that data is ready
        render();

    } catch (error) {
        console.error("Firebase Fetch Error:", error);
    }
}

/**
 * Captures user input, sends a new card to the cloud, and updates local state.
 * @async
 */
async function createNewCard() {
    const frontText = frontInput.value;
    const backText = backInput.value;

    // Validation: Ensure user has entered text on both sides
    if (!frontText || !backText) {
        alert("Please fill out both sides!");
        return;
    }

    try {
        console.log("Sending card to cloud...");

        // Step 1: Persist card to Firestore
        const docRef = await addDoc(collection(db, "words"), {
            front: frontText,
            back: backText,
            createdAt: new Date()
        });

        // Step 2: Perform an 'Optimistic Update' by adding the card to our local State
        state.flashCards.push({
            id: docRef.id,
            front: frontText,
            back: backText
        });

        // Step 3: Clear form and re-render the view
        frontInput.value = "";
        backInput.value = "";
        render();

    } catch (error) {
        console.error("Error adding card:", error);
    }
}

/**
 * SECTION 6: THE RENDER ENGINE
 * The only function responsible for updating the HTML.
 */
function render() {
    const currentCard = state.flashCards[state.currentIndex];

    // Safety check: Exit if the database is empty
    if (!currentCard) return;

    // Update text based on the flip state (Ternary operator: condition ? true : false)
    flashCardDisplay.textContent = state.isFlipped ? currentCard.back : currentCard.front;

    debugState("UI Re-rendered");
}

/**
 * SECTION 7: EVENT LISTENERS
 * Linking user clicks to state changes.
 */

nextBtn.addEventListener('click', () => {
    // Increment index, looping back to 0 at the end of the array using Modulo (%)
    state.currentIndex = (state.currentIndex + 1) % state.flashCards.length;
    state.isFlipped = false; // Always show front of a new card
    render();
});

flipBtn.addEventListener('click', () => {
    state.isFlipped = !state.isFlipped;
    render();
});

saveBtn.addEventListener('click', createNewCard);

/**
 * SECTION 8: DEBUGGING TOOL
 * Provides a snapshot of the current application state in the console.
 */
function debugState(action) {
    console.group(`%cDebug: ${action}`, "color: #007bff; font-weight: bold;");
    console.log("State:", state);
    console.groupEnd();
}

// BOOTSTRAP: Initial data load
fetchJsonData();