import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)

CORS(app, origins="http://localhost:5173")

genai.configure(api_key="hidden")
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat()

@app.route('/chat', methods=['POST'])
def chat_with_bot():
    try:
        message = request.json.get('message')
        
        if not message:
            return jsonify({"error": "No message provided"}), 400

        response = chat.send_message(message)

        return jsonify({"response": response.text})

    except Exception as error:
        print(f"Error in chatbot communication: {error}")
        return jsonify({"error": "Internal Server Error", "details": str(error)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
