from flask import redirect, render_template, session
from functools import wraps

def apology(message, code=400):
    """Render message as an apology to user."""

    return render_template("apology.html", top=code, bottom=message)