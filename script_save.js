// const wordSet = [
//     "apple", "banana", "orange", "strawberry", "grape", "pineapple", 
//     "blueberry", "mango", "pear", "peach", "watermelon", "kiwi", 
//     "melon", "avocado", "plum", "cherry", "coconut", "apricot", 
//     "lime", "lemon"
//   ];
  
let wordSet = [];

  let startTime;
  let interval;
  let isTimedMode = true;
  // let currentText = generateText(); // Generate text to be typed
  let currentText = ""; // Generate text after words are initialized

  let timer = 0;
  let wordCount = 0;
  let correctWords = 0;
  let testStarted = false;
  
  const displayText = document.getElementById("display-text");
  const inputOverlay = document.getElementById("input-overlay");
  const timerElement = document.getElementById("timer");
  const wpmElement = document.getElementById("wpm");
  const toggleButton = document.getElementById("toggle-mode");
  
  initializeWords();


  // Display the generated text
  displayText.innerText = currentText;


  const cursor = document.createElement("span");
  cursor.id = "custom-cursor";
  
  // Append the cursor to the displayText area
  displayText.appendChild(cursor);
  
  // Position the cursor correctly when the page loads
  window.addEventListener("load", function() {
    setTimeout(() => {
      const inputOverlay = document.getElementById('input-overlay');
      inputOverlay.focus();  // Focus the textarea to start typing
      inputOverlay.setSelectionRange(0, 0);  // Set the initial cursor position
  
      // Make sure the custom cursor appears at the start
      cursor.style.left = "10px"; // Adjust as needed to align with the first character
    }, 10);  // Delay to ensure everything is loaded before focusing
  });

//-------------------------------------------------------------------------------------

async function fetchWords() {
  const response = await fetch('https://api.datamuse.com/words?ml=random&v=enwiki');
  const data = await response.json();
    return data.map(wordObj => wordObj.word);
}

async function initializeWords() {
  wordSet = await fetchWords(); // Populate the wordSet array
  console.log("Fetched words:", wordSet.slice(0, 100)); // Log a small sample of words
  currentText = generateText(10); // Generate the initial text to display
  displayText.innerText = currentText; // Display the generated text
}
initializeWords();
//-------------------------------------------------------------------------------------
  
function generateText(wordCount = 10) {
  // Shuffle the wordSet
  const shuffledWords = shuffleArray([...wordSet]);

  // Select the first `wordCount` words
  const selectedWords = shuffledWords.slice(0, wordCount);

  return selectedWords.join(" ") + " ";
}

// Helper function to shuffle the array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
  function startTest() {
    inputOverlay.value = ""; // Reset input box
    timer = 0; // Reset timer
    wordCount = 0; // Reset word count
    correctWords = 0; // Reset correct words count
    wpmElement.innerText = "0"; // Reset WPM display
    timerElement.innerText = "0"; // Reset timer display
    clearInterval(interval); // Clear any existing intervals
    startTime = new Date(); // Set the start time
    interval = setInterval(updateTimer, 1000); // Start the timer
    testStarted = true;
  }
  

  function handleTyping(event) {
    const typedText = inputOverlay.value;
    let highlightedText = "";
    let isComplete = true;

    // Start the test when the first key is pressed
    const key = event.data;
    if (!testStarted && key && key.trim() !== "") {
        testStarted = true;
        startTest();
    }

    // Highlight text
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                highlightedText += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highlightedText += `<span class="incorrect">${currentText[i]}</span>`;
                isComplete = false;
            }
        } else {
            highlightedText += `<span>${currentText[i]}</span>`;
        }
    }

    displayText.innerHTML = highlightedText;

    // Reattach the cursor
    displayText.appendChild(cursor);

    // Update the custom cursor position
    const spans = displayText.querySelectorAll("span");
    let totalWidth = 10; // Start with padding-left offset
    for (let i = 0; i < typedText.length; i++) {
        if (spans[i]) {
            totalWidth += spans[i].getBoundingClientRect().width;
        }
    }
    cursor.style.left = `${totalWidth}px`;

    // Check if the typing is complete
    if (typedText.trim() === currentText.trim() && event.data === " ") {
        completeTest();
    }

    if (typedText.length === currentText.length) {
        completeTest();
    }

    updateWPM();
}
  
  function updateTimer() {
    timer++;
    timerElement.innerText = timer; // Update timer display
  }
  
  function updateWPM() {
    const typedText = inputOverlay.value;
    const wordsTyped = typedText.trim().split(" ").filter(word => word.length > 0);
  
    // Update correct words count
    correctWords = wordsTyped.reduce((count, word, index) => {
      if (word === currentText.split(" ")[index]) {
        return count + 1;
      }
      return count;
    }, 0);
  
    // Calculate WPM based on correct words and time
    const minutes = timer / 60;
    const wpm = minutes > 0 ? Math.floor(correctWords / minutes) : 0;
  
    console.log("WPM: ", wpm); // Add logging to check if WPM is being calculated
    wpmElement.innerText = wpm; // Update WPM display
  }

  function completeTest() {
    clearInterval(interval); // Stop the timer
    
    const totalWords = currentText.trim().split(" ").length;
    const accuracy = ((correctWords / totalWords) * 100).toFixed(2);
    
    const wpm = wpmElement.innerText;
    
    // Redirect to the results page with URL parameters
    window.location.href = `results.html?wpm=${wpm}&time=${timer}&accuracy=${accuracy}`;
  }
  
  // Add event listeners
  inputOverlay.addEventListener("input", handleTyping);
  
  // Toggle between timed mode and word count mode
  toggleButton.addEventListener("click", () => {
    isTimedMode = !isTimedMode;
    toggleButton.innerText = isTimedMode ? "Switch to Word Mode" : "Switch to Time Mode";
    startTest();
  });
