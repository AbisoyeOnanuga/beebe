// Define the function for sending user input to the backend service and receiving model output as a response
async function sendMessage(e) {
  // Prevent default behaviour of send event
  e.preventDefault();
  // Get the user input from the input field
  let userInput = document.getElementById("input-field").value;
  // Clear the input field
  document.getElementById("input-field").value = "";
  // Display the user input in the conversation div using innerHTML
  chatbox.insertAdjacentHTML("beforeend", `<div class="user-message">${userInput}</div>`);  // Scroll to the bottom of the conversation div
  conversation.scrollTop = conversation.scrollHeight;
  
  // Send a POST request to the backend service with the user input as a JSON body
  try {
    let response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"user_input": userInput})
    });
    // Check the status of the response
    if (response.ok) {
      // Parse the response as a JSON object
      let data = await response.json();
      
      // Get the model output from the JSON object
      let chatbotOutput = data["model_output"];

      // Return the chatbot output as a promise
      return chatbotOutput;
    } else {
      // Throw an error if the response is not ok
      throw new Error("Something went wrong");
    }
  } catch (error) {
    // Log the error in the console
    console.error(error);
  }
}

function displayMessage(chatbotOutput) {
  // Get the chatbox element by its id
  let chatbox = document.getElementById("chatbox");
  // Get the user input from the input field
  let userInput = document.getElementById("input-field").value;
  // Display the user input in the chatbox element using innerHTML
  chatbox.insertAdjacentHTML("beforeend", `<div class="user-message">${userInput}</div>`);
  // Display the chatbot output in the chatbox element using innerHTML
  chatbox.insertAdjacentHTML("beforeend", `<div class="chatbot-message">${chatbotOutput}</div>`);
}


// Add an event listener for the send button
document.getElementById("send").addEventListener("click", sendMessage)
{
  displayMessage();
}