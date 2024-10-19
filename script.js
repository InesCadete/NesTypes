

const wordSet = [
    "apple", "banana", "orange", "strawberry", "grape", "pineapple", "blueberry", "mango", "pear", "peach", 
    "watermelon", "kiwi", "melon", "avocado", "plum", "cherry", "coconut", "apricot", "lime", "lemon"
]; // A simple word set for testing

let startTime;
let interval;
let isTimedMode = true; // Toggle between time mode and word mode

const displayText = document.getElementById("display-text");
const inputBox = document.getElementById("input-box");
const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const toggleButton = document.getElementById("toggle-mode");

let currentText = ""; // The text currently being typed
let timer = 0; // Timer in seconds
let wordCount = 0; // Count of correctly typed words

// Choose a random set of words from the array
function generateText(wordCount = 50) {
    let words = [];
    for (let i = 0; i < wordCount; i++) {
        words.push(wordSet[Math.floor(Math.random() * wordSet.length)]);
    }
    return words.join(" ");
}

// Start timer and reset everything
function startTest() {
    currentText = generateText();
    displayText.innerText = currentText;
    inputBox.value = ""; // Reset input box
    timer = 0;
    wordCount = 0;
    wpmElement.innerText = "0";
    clearInterval(interval);
    startTime = new Date();
    interval = setInterval(updateTimer, 1000); // Update timer every second
}

// Highlight the typed text
function handleTyping() {
    const typedText = inputBox.value;
    let correct = true;
    let highlightedText = "";
    
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                highlightedText += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${currentText[i]}</span>`;
                correct = false;
            }
        } else {
            highlightedText += currentText[i];
        }
    }
    displayText.innerHTML = highlightedText;
    
    if (correct && typedText.length === currentText.length) {
        // Completed the text, stop timer
        clearInterval(interval);
        calculateWPM();
    }
}

// Update the timer every second
function updateTimer() {
    timer++;
    timerElement.innerText = timer;
    calculateWPM();
}

// Calculate Words per Minute (WPM)
function calculateWPM() {
    const typedText = inputBox.value;
    const wordsTyped = typedText.split(" ").filter(word => word.length > 0); // Count valid words
    wordCount = wordsTyped.length;
    const wpm = Math.floor((wordCount / timer) * 60); // Words per minute
    wpmElement.innerText = wpm;
}

// Toggle between timed mode and word count mode
toggleButton.addEventListener("click", () => {
    isTimedMode = !isTimedMode;
    toggleButton.innerText = isTimedMode ? "Switch to Word Mode" : "Switch to Time Mode";
    startTest();
});

// Listen for typing in the input box
inputBox.addEventListener("input", handleTyping);

// Start the test when the page loads
window.onload = startTest;
