def route(intent, sentiment):

    priority = "MEDIUM"

    team = "Support"

    if sentiment == "NEGATIVE":

        priority = "HIGH"

    if intent == "payment issue":

        team = "Billing"

    elif intent == "login issue":

        team = "Authentication"

    elif intent == "technical bug":

        team = "Engineering"

    return {

        "priority": priority,

        "team": team
    }