import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {api_key[:5]}...{api_key[-5:] if api_key else 'None'}")

if not api_key:
    print("ERROR: No API Key found in .env")
    exit()

genai.configure(api_key=api_key)

print("\nListing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")

print("\nTesting gemini-1.5-flash...")
try:
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello")
    print("Success! (gemini-1.5-flash)")
except Exception as e:
    print(f"Failed (gemini-1.5-flash): {e}")
