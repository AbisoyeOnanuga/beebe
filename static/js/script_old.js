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
  
  // Send a POST request to the Flask app with the user input as a JSON body
  await fetch("http://localhost:8000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_input: userInput }),
  })
  .then(response => {
    // Check the status of the response
    if (response.ok) {
      // Parse the response as a JSON object
      return response.json();
    } else {
      // Throw an error if the response is not ok
      throw new Error("Something went wrong");
    }
  })
  .then(data => {
    // Get the model output from the JSON object
    let chatbotOutput = data["model_output"];

    // Display the chatbot output in the chatbox element using innerHTML
    chatbox.insertAdjacentHTML("beforeend", `<div class="chatbot-message">${chatbotOutput}</div>`);
  })
  .catch(error => {
    // Log the error in the console
    console.error(error);
    // Display an error message in the chatbox element using innerHTML
    chatbox.insertAdjacentHTML("beforeend", `<div class="error-message">Sorry, something went wrong. Please try again later.</div>`);
  });
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

// Add an event listener for the send button
document.getElementById("send").addEventListener("click", function(e) {
  // Call the sendMessage function with the event object
  sendMessage(e);
  // Call the checkChatFull function
  checkChatFull();
});