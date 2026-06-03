from transformers import pipeline
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

# ---------- Gemini Setup ----------

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# ---------- Sentiment Model ----------

sentiment_model = pipeline(
    "sentiment-analysis",  # type: ignore
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
)

# ---------- Original BART Zero-Shot Model (COMMENTED FOR DEPLOYMENT) ----------

"""
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

    # ----- Sentiment -----

    sentiment = sentiment_model(text)

    # ----- Gemini Intent Classification -----

    prompt = f"""
    Classify the following customer support query into EXACTLY ONE category.

    Categories:
    {', '.join(candidate_labels)}

    User Query:
    {text}

    Return ONLY:
    label | confidence

    Example:
    refund request | 94
    """

    response = gemini_model.generate_content(prompt)

    result = response.text.strip()

    try:
        intent_label, confidence = result.split("|")

        intent_label = intent_label.strip()
        confidence = float(confidence.strip())

    except:
        intent_label = "general query"
        confidence = 70.0

    # ----- Original BART Logic (COMMENTED) -----

    """
    intent = intent_model(text, candidate_labels=candidate_labels)

    confidence = round(
        intent["scores"][0] * 100,
        2
    )

    intent_label = intent["labels"][0]
    """

    return {
        "sentiment": sentiment[0]["label"],
        "intent": intent_label,
        "confidence": confidence
    }