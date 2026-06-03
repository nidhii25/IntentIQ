import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

# ---------- Gemini Setup ----------

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

gemini_model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

# ---------- Original Transformer Models (COMMENTED FOR DEPLOYMENT) ----------

"""
from transformers import pipeline

sentiment_model = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
)

intent_model = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)
"""

candidate_labels = [

    "payment issue",
    "refund request",
    "login issue",
    "technical bug",
    "shipping problem",
    "feature request",
    "general query"
]


def analyze(text):

    prompt = f"""
    Analyze this customer support message.

    TASKS:

    1. Predict sentiment:
       POSITIVE or NEGATIVE

    2. Predict EXACTLY ONE intent from:

       {', '.join(candidate_labels)}

    3. Give confidence score (0-100)

    Message:
    {text}

    Return ONLY in this format:

    sentiment | intent | confidence

    Example:

    NEGATIVE | refund request | 92
    """

    response = gemini_model.generate_content(prompt)

    result = response.text.strip()

    try:

        sentiment, intent_label, confidence = result.split("|")

        sentiment = sentiment.strip()

        intent_label = intent_label.strip()

        confidence = float(
            confidence.strip()
        )

    except:

        sentiment = "NEGATIVE"

        intent_label = "general query"

        confidence = 70.0

    # ---------- Original BART Logic (COMMENTED) ----------

    """
    sentiment = sentiment_model(text)

    intent = intent_model(
        text,
        candidate_labels=candidate_labels
    )

    confidence = round(
        intent["scores"][0] * 100,
        2
    )

    sentiment = sentiment[0]["label"]

    intent_label = intent["labels"][0]
    """

    return {

        "sentiment": sentiment,

        "intent": intent_label,

        "confidence": confidence
    }