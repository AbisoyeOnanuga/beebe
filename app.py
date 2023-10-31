# Import the necessary modules
from flask import Flask, render_template, request
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import os
import torch
import json
from flask_cors import CORS, cross_origin

# Create a Flask app object and specify the static_folder argument
app = Flask(__name__, static_folder="static")

# Enable CORS for all domains and all routes
cors = CORS(app, resources={r"/generate": {"origins": ["http://localhost:8000"]}})

# Define a route for rendering the index.html file
@app.route('/')
def index():
    return render_template('index.html')

# Load the GPT-2 model and tokenizer from the local folder
model_path = os.path.join(os.getcwd(), "./output-gpt2")
tokenizer_path = os.path.join(os.getcwd(), "./output-gpt2")
model = GPT2LMHeadModel.from_pretrained(model_path)
tokenizer = GPT2Tokenizer.from_pretrained(tokenizer_path)

# Define a function for generating responses using the model
def generate_response(user_input):
    # Encode the user input and add the end-of-text token
    input_ids = tokenizer.encode(user_input, return_tensors="pt")
    input_ids = torch.cat([input_ids, torch.tensor([tokenizer.eos_token_id]).unsqueeze(0)], dim=-1)
    # Generate a response using the model
    output_ids = model.generate(input_ids, max_length=50, do_sample=True, top_p=0.9)
    # Decode the output and remove the end-of-text token
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    # Return the output text
    return output_text

# Define a route for generating responses
@app.route('/generate', methods=["POST"])
# Use the cross_origin decorator to enable CORS for this route
@cross_origin()
def generate():
  # Get the user input from the request body
  user_input = request.json["user_input"]
  # Try to generate a response using the model
  try:
    chatbot_output = generate_response(user_input)
    # Convert the output to a JSON string
    chatbot_output = json.dumps({"model_output": chatbot_output})
    # Return the output as a JSON string with the application/json content type
    return chatbot_output, 200, {"Content-Type": "application/json"}
  except Exception as e:
    # Log the exception in the console
    print(e)
    # Return an error message as a JSON string with the application/json content type
    return json.dumps({"model_output": "Sorry, something went wrong. Please try again later."}), 500, {"Content-Type": "application/json"}

# Run the Flask app with debug mode and extra files to watch for changes
app.config["DEBUG"] = True
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["EXTRA_FILES"] = ["static/index.html", "static/js/script.js", "static/css/style.css"]
app.run(port=8000)