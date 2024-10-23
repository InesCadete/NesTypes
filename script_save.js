const wordSet = [
    "apple", "banana", "orange", "strawberry", "grape", "pineapple", 
    "blueberry", "mango", "pear", "peach", "watermelon", "kiwi", 
    "melon", "avocado", "plum", "cherry", "coconut", "apricot", 
    "lime", "lemon"
  ];
  
  let startTime;
  let interval;
  let isTimedMode = true;
  let currentText = generateText(); // Generate text to be typed
  let timer = 0;
  let wordCount = 0;
  let correctWords = 0;
  let testStarted = false;
  
  const displayText = document.getElementById("display-text");
  const inputOverlay = document.getElementById("input-overlay");
  const timerElement = document.getElementById("timer");
  const wpmElement = document.getElementById("wpm");
  const toggleButton = document.getElementById("toggle-mode");
  
  // Display the generated text
  displayText.innerText = currentText;
  
  function generateText(wordCount = 10) {
    let words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(wordSet[Math.floor(Math.random() * wordSet.length)]);
    }
    return words.join(" ") + " ";
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
  
    const key = event.data;

     // Start the test when the first key is pressed, but keep the first letter in the input
     if (!testStarted && key && key.trim() !== "") {
        testStarted = true;
        startTest();  // Start the test when the first key is pressed
        typedText += key;  // Manually add the first key to the typedText
        inputOverlay.value = typedText; // Ensure the input value includes the first typed letter
    }


    // Highlight text
    // CORRIGIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR-> para a primeira letra tenho de fazer start test 
    //-> e tambem 

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
