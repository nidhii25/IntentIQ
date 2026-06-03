import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("gemini_api_key")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def generate_reply(
        text,
        intent,
        sentiment,
        priority
):

    prompt = f"""
You are a professional support agent.

Customer Message:
{text}

Intent:
{intent}

Sentiment:
{sentiment}

Priority:
{priority}

Generate a concise, empathetic, professional support reply.
"""

    response = model.generate_content(
        prompt
    )

    return response.text
