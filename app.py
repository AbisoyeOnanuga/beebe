# Import the necessary modules
from flask import Flask, render_template, request, jsonify
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import os

# Create a Flask app object and specify the static_folder argument
app = Flask(__name__)

# Define a route for rendering the index.html file
@app.route('/')
def index():
    return render_template('index.html')

# Load the GPT-2 model and tokenizer from the local folder
model_path = os.path.join(os.getcwd(), "gpt2")
model = GPT2LMHeadModel.from_pretrained(model_path)
tokenizer = GPT2Tokenizer.from_pretrained(model_path)

# Define a function for generating responses using the model
def generate_response(user_input):
    # Encode the user input and add the end-of-text token
    input_ids = tokenizer.encode(user_input, return_tensors="pt", add_special_tokens=True)
    # Generate a response using the model
    output_ids = model.generate(input_ids, max_length=50, do_sample=True, top_p=0.9)
    # Decode the output and remove the end-of-text token
    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    # Return the output text
    return output_text

# Define a route for generating responses
@app.route('/generate', methods=["POST"])
def generate():
    # Get the user input from the request body
    user_input = request.json["user_input"]
    # Generate a response using the model
    model_output = generate_response(user_input)
    # Return the output as a JSON object
    return jsonify({"model_output": model_output})

# Run the Flask app with debug mode and extra files to watch for changes
app.config["DEBUG"] = True
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["EXTRA_FILES"] = ["static/index.html", "static/js/script.js", "static/css/style.css"]