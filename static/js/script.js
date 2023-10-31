// Define the function for sending user input to the backend service and receiving model output as a response
async function sendMessage() {
  // Get the user input from the input field
  let userInput = document.getElementById("input-field").value;
  // Clear the input field
  document.getElementById("input-field").value = "";
  // Display the user input in the conversation div
  let conversation = document.getElementById("conversation");
  conversation.innerHTML += `<div class="chatbot-message"><p class="user-text">${userInput}</p></div>`;
  // Scroll to the bottom of the conversation div
  conversation.scrollTop = conversation.scrollHeight;
  
  // Send a POST request to the backend service with the user input as a JSON body
  let response = await fetch("http://localhost:5000/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"user_input": userInput})
  });
  
  // Parse the response as a JSON object
  let data = await response.json();
  
  // Get the model output from the JSON object
  let modelOutput = data["model_output"];
  
  // Display the model output in the conversation div
  conversation.innerHTML += `<div class="chatbot-message"><p class="bot-text">${modelOutput}</p></div>`;
  
   // Scroll to the bottom of the conversation div
   conversation.scrollTop = conversation.scrollHeight; 
  
}

// Add an event listener for the submit button
document.getElementById("submit-button").addEventListener("click", sendMessage);