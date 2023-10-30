    // Define the function for sending user input to the backend service and receiving model output as a response
    async function sendMessage() 
    {
        // Get the user input from the input element
        let userInput = document.getElementById("input").value;
        // Clear the input element
        document.getElementById("input").value = "";
        // Display the user input in the chatbox element
        let chatbox = document.getElementById("chatbox");
        chatbox.innerHTML += `<div class="message"><span class="user">User:</span> ${userInput}</div>`;
        // Scroll to the bottom of the chatbox element
        chatbox.scrollTop = chatbox.scrollHeight;
        
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
        let modelOutput = data["output_text"];
        
        // Display the model output in the chatbox element
        chatbox.innerHTML += `<div class="message"><span class="bot">Bot:</span> ${modelOutput}</div>`;
        
         // Scroll to the bottom of the chatbox element
         chatbox.scrollTop = chatbox.scrollHeight; 
        
    }