from transformers import pipeline

sentiment_model = pipeline("sentiment-analysis",# type: ignore
model="distilbert/distilbert-base-uncased-finetuned-sst-2-english") 
intent_model = pipeline("zero-shot-classification",model="facebook/bart-large-mnli")

candidate_labels=[

    "payment issue",

    "refund request",

    "login issue",

    "technical bug",

    "shipping problem",

    "feature request",

    "general query"
]




def analyze(text):
    sentiment = sentiment_model(text)
    intent = intent_model(text, candidate_labels=candidate_labels)
    print(intent)
    confidence = round(#type: ignore
        intent["scores"][0]*100,2 #type: ignore
    )
    return {
        "sentiment": sentiment[0]['label'],
        "intent": intent['labels'][0], #type: ignore
        "confidence": confidence 
    }