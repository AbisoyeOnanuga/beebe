from flask import Flask
from gpt2 import gpt2

app = Flask(__name__)

# Register blueprints here
# For example, if you have a blueprint called main in a file called main.py, you can use:
# from main import main
# app.register_blueprint(main)

# Import GPT-2 model and tokenizer from gpt2 folder
model = gpt2.load_model()
tokenizer = gpt2.load_tokenizer()