from fastapi import APIRouter
from pydantic import BaseModel

from nlp.predictor import analyze
from nlp.rules import route
from nlp.decision import decide
from nlp.alerts import owner_alert
from nlp.reply import generate_reply

router = APIRouter()

class UserInput(BaseModel):
    text: str


@router.post("/predict")
def predict(data: UserInput):

    text = data.text

    try:
        result = analyze(text)

    except Exception as e:

        return {
            "error": "Analysis failed",
            "details": str(e)
        }

    routing = route(
        result["intent"],
        result["sentiment"]
    )

    mode = decide(
        text,
        result["confidence"]
    )

    reply = None
    alert = False

    if mode in [

        "AUTO_RESPONSE",
        "OWNER_ALERT"

    ]:

        reply = generate_reply(

            text,
            result["intent"],
            result["sentiment"],
            routing["priority"]

        )

    elif mode == "HUMAN_REVIEW":

        reply = (
            "Thank you for contacting us. "
            "Your request requires manual review by a specialist."
        )

    elif mode == "CRITICAL_ESCALATION":

        reply = (
            "Your concern has been escalated immediately to our support team."
        )

    if mode in [

        "OWNER_ALERT",
        "HUMAN_REVIEW",
        "CRITICAL_ESCALATION"

    ]:

        alert = owner_alert(

            text,
            result["intent"],
            result["confidence"]

        )

    return {

        "intent": result["intent"],
        "confidence": result["confidence"],
        "sentiment": result["sentiment"],
        "priority": routing["priority"],
        "team": routing["team"],
        "mode": mode,
        "owner_alert": alert,
        "reply": reply
    }