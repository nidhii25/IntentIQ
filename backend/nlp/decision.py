HIGH_THRESHOLD = 70
MEDIUM_THRESHOLD = 50

CRITICAL_KEYWORDS = [

    "fraud",
    "lawsuit",
    "chargeback",
    "consumer court",
    "cancel account",
    "hack",
    "data leak"

]


def decide(text, confidence):

    lower = text.lower()

    if any(
        keyword in lower
        for keyword in CRITICAL_KEYWORDS
    ):

        return "CRITICAL_ESCALATION"

    if confidence >= HIGH_THRESHOLD:

        return "AUTO_RESPONSE"

    elif confidence >= MEDIUM_THRESHOLD:

        return "OWNER_ALERT"

    return "HUMAN_REVIEW"