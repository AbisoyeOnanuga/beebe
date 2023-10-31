// Get the chatbox element by its id
let chatbox = document.getElementById("chatbox");

// Define the function for sending user input to the Flask app and receiving model output as a response
async function sendMessage(e) {
  // Prevent default behaviour of send event
  e.preventDefault();
  // Get the user input from the input field
  let userInput = document.getElementById("input-field").value;
  // Clear the input field
  document.getElementById("input-field").value = "";
  
  // Display the user input in the chatbox element using innerHTML
  chatbox.insertAdjacentHTML("beforeend", `<div class="user-message">${userInput}</div>`);  
  // Scroll to the bottom of the chatbox element
  chatbox.scrollTop = chatbox.scrollHeight;
  
  // Check if there is already a request in progress
  if (isLoading) {
    // If yes, do nothing and return
    return;
  }
  // If no, set the isLoading variable to true
  isLoading = true;
  
  // Send a POST request to the Flask app with the user input as a JSON body
  // Use fetch instead of $.ajax
  let response = await fetch("http://localhost:8000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "user_input": userInput }),
  });
  
  // Set the isLoading variable back to false
  isLoading = false;
  
  // Check the status of the response
  if (response.ok) {
    // Parse the response as a JSON object
    let data = await response.json();
    // Get the model output from the JSON object
    let chatbotOutput = data["model_output"];
    // Display the chatbot output in the chatbox element using innerHTML
    chatbox.insertAdjacentHTML("beforeend", `<div class="chatbot-message">${chatbotOutput}</div>`);
  } else {
    // Throw an error if the response is not ok
    throw new Error("Something went wrong");
  }
  
  // Return false to prevent the default action
  return false;
}

// Define a variable to store the number of messages in the chatbox
let messageCount = 0;

// Define a function that checks if the chatbox is full and restarts the conversation if so
function checkChatFull() {
  // Increment the message count by one
  messageCount++;
  // If the message count reaches 30, clear the chatbox and display a restart message
  if (messageCount === 30) {
    chatbox.innerHTML = "";
    chatbox.insertAdjacentHTML("beforeend", `<div class="restart-message">Chat full, please restart the conversation.</div>`);
    // Reset the message count to zero
    messageCount = 0;
  }
}

// Declare a global variable to store the request status
var isLoading = false;

// Add an event listener for the send button
document.getElementById("send").addEventListener("click", function(e) {
  // Call the sendMessage function with the event object
  sendMessage(e);
  // Call the checkChatFull function
  checkChatFull();
});