import { Ai } from "./vendor/@cloudflare/ai.js";
const ai = new Ai(context.env.AI);

async function getResponse(messages) {
  // Use the @cf/meta/llama-2-7b-chat-int8 model to generate chat responses
  const response = await ai.run("@cf/meta/llama-2-7b-chat-int8", {
    messages: messages,
  });
  // Return the text of the response
  return response.text;
}

// Add an event listener for the send button
document.getElementById("send").addEventListener("click", async function (e) {
  // Prevent default behaviour of send event
  e.preventDefault();
  // Get the user input from the input field
  let userInput = document.getElementById("input-field").value;
  let chatbox = document.getElementById("chatbox");
  // Clear the input field
  document.getElementById("input-field").value = "";

  // Display the user input in the chatbox element using innerHTML
  chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;
  // Scroll to the bottom of the chatbox element
  chatbox.scrollTop = chatbox.scrollHeight;

  // Check if there is already a request in progress
  if (isLoading) {
    // If yes, do nothing and return
    return;
  }
  // If no, set the isLoading variable to true
  isLoading = true;

  // Create a messages array with one user message object
  let messages = [{ role: "user", content: userInput }];

  // Call the getResponse function with the messages array and await for the result
  let aiResponse = await getResponse(messages);

  // Set the isLoading variable back to false
  isLoading = false;

  // Display the chatbot output in the chatbox element using innerHTML
  chatbox.innerHTML += `<div class="chatbot-message">${aiResponse}</div>`;
  
  // Call the checkChatFull function
  checkChatFull();
});

// Define a variable to store the number of messages in the chatbox
let messageCount = 0;

// Define a function that checks if the chatbox is full and restarts the conversation if so
function checkChatFull() {
  // Increment the message count by one
  messageCount++;
  // If the message count reaches 30, clear the chatbox and display a restart message
  if (messageCount === 10) {
    chatbox.innerHTML = "";
    chatbox.insertAdjacentHTML("beforeend", `<div class="restart-message">Chat full, please restart the conversation.</div>`);
    // Reset the message count to zero
    messageCount = 0;
  }
}