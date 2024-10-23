const wordSet = [
    "apple", "banana", "orange", "strawberry", "grape", "pineapple", 
    "blueberry", "mango", "pear", "peach", "watermelon", "kiwi", 
    "melon", "avocado", "plum", "cherry", "coconut", "apricot", 
    "lime", "lemon"
]; // A simple word set for testing









let startTime;
let interval;
let isTimedMode = true; // Toggle between time mode and word mode

const displayText = document.getElementById("display-text");
const inputOverlay = document.getElementById("input-overlay");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const toggleButton = document.getElementById("toggle-mode");

let currentText = ""; // The text currently being typed
let timer = 0; // Timer in seconds
let wordCount = 0; // Count of correctly typed words

// Choose a random set of words from the array
function generateText(wordCount = 10) {
    let words = [];
    for (let i = 0; i < wordCount; i++) {
        words.push(wordSet[Math.floor(Math.random() * wordSet.length)]);
    }
    return words.join(" ") + " "; // Ensure there's a trailing space
}

// Start timer and reset everything
function startTest() {
    currentText = generateText(); // Generate text to be typed
    displayText.innerText = currentText; // Display the generated text
    inputOverlay.value = ""; // Reset input box
    timer = 0; // Reset timer
    wordCount = 0; // Reset word count
    wpmElement.innerText = "0"; // Reset WPM display
    timerElement.innerText = "0"; // Reset timer display
    clearInterval(interval); // Clear any existing intervals
    startTime = new Date(); // Set the start time
    interval = setInterval(updateTimer, 1000); // Start the timer
}

// Track if the test has started
let testStarted = false;

function handleTyping(event) {
    if (!testStarted) {
        startTest(); // Start the test when the first key is pressed
        testStarted = true;
    }

    const typedText = inputOverlay.value; // Get the value of the input box
    let highlightedText = ""; // For building the highlighted text
    let isComplete = true; // Track if typing is complete

    // Highlighting the text based on user input
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                highlightedText += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${currentText[i]}</span>`;
                isComplete = false; // Mark as incomplete if there's an error
            }
        } else {
            highlightedText += `<span>${currentText[i]}</span>`; // Remaining text without highlights
        }
    }

    // Update display with highlighted text
    displayText.innerHTML = highlightedText;

    // End the test if the user hits the space after the last word
    if (typedText.trim() === currentText.trim() && event.data === " ") {
        completeTest();
    }

    // Check if all characters are correct and the test is complete
    if (isComplete && typedText.length === currentText.length) {
        completeTest();
    }

    // Scroll to ensure that the last 3 lines are visible
    displayText.scrollTop = displayText.scrollHeight;
}

// Update the timer every second
function updateTimer() {
    timer++;
    timerElement.innerText = timer; // Update timer display
    calculateWPM(); // Update WPM display
}

// Calculate Words per Minute (WPM)
function calculateWPM() {
    const typedText = inputOverlay.value; // Get the current input
    const wordsTyped = typedText.split(" ").filter(word => word.length > 0); // Count valid words
    wordCount = wordsTyped.length; // Update word count
    const wpm = Math.floor((wordCount / timer) * 60); // Calculate WPM
    wpmElement.innerText = wpm; // Display WPM
}

// Complete the test and display results
function completeTest() {
    clearInterval(interval); // Stop the timer
    const minutes = Math.floor(timer / 60); // Calculate minutes
    const seconds = timer % 60; // Calculate remaining seconds

    // Display final results
    results.innerHTML = `Time: ${minutes}m ${seconds}s | WPM: ${wpmElement.innerText}`;
    results.style.display = "block"; // Show results
    resultImage.style.display = "block"; // Show result image
}

// Toggle between timed mode and word count mode
toggleButton.addEventListener("click", () => {
    isTimedMode = !isTimedMode; // Toggle mode
    toggleButton.innerText = isTimedMode ? "Switch to Word Mode" : "Switch to Time Mode"; // Update button text
    startTest(); // Restart the test with the new mode
});

// Listen for typing in the input box
inputOverlay.addEventListener("input", handleTyping);
