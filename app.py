# Import the necessary modules
from flask import Flask, request, jsonify
from transformers import GPT2LMHeadModel, GPT2Tokenizer

# Create a Flask app
app = Flask(__name__)

# Load the pre-trained model and tokenizer from the repository
model = GPT2LMHeadModel.from_pretrained("D://documents/vscode/gpt2")
tokenizer = GPT2Tokenizer.from_pretrained("D://documents/vscode/gpt2")

# Define a route for generating responses
@app.route("/generate", methods=["POST"])
def generate():
    # Get the user input from the request body
    user_input = request.json["user_input"]
    # Encode the user input and add the end-of-text token
    input_ids = tokenizer.encode(user_input, return_tensors="pt", add_special_tokens=True)
    # Generate a response using the model
    output_ids = model.generate(input_ids, max_length=50, do_sample=True, top_p=0.9)
    # Decode the output and remove the end-of-text token
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    # Return the output as a JSON object
    return jsonify({"output_text": output_text})
