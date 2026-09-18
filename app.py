"""
Dental Appointment Management System
Flask + LangGraph + Groq GPT-OSS 20B
"""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, session
from langchain_core.messages import AIMessage, HumanMessage

from dental_agent.agent import dental_graph

load_dotenv()


# -----------------------------------------------------------------------------
# Application Configuration
# -----------------------------------------------------------------------------

app = Flask(__name__)

SECRET_KEY = os.getenv("FLASK_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError(
        "FLASK_SECRET_KEY is not configured. "
        "Add it to your .env file or deployment environment."
    )

app.config.update(
    SECRET_KEY=SECRET_KEY,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "false").lower()
    == "true",
    MAX_CONTENT_LENGTH=1024 * 1024,  # 1 MB request limit
)


# -----------------------------------------------------------------------------
# Security Headers
# -----------------------------------------------------------------------------

@app.after_request
def add_security_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "SAMEORIGIN"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=()"
    )

    return response


# -----------------------------------------------------------------------------
# Helper Functions
# -----------------------------------------------------------------------------

def get_chat_history():
    """
    Convert the serialized Flask session history back into
    LangChain message objects.
    """

    history_data = session.get("chat_history", [])

    history = []

    for message in history_data:
        role = message.get("role")
        content = message.get("content", "")

        if not content:
            continue

        if role == "user":
            history.append(HumanMessage(content=content))

        elif role == "assistant":
            history.append(AIMessage(content=content))

    return history


def save_chat_history(messages):
    """
    Save only user and assistant messages to the Flask session.

    Tool messages and internal LangGraph state are not stored in the
    browser session.
    """

    history = []

    for message in messages:

        if isinstance(message, HumanMessage):
            if message.content:
                history.append(
                    {
                        "role": "user",
                        "content": message.content,
                    }
                )

        elif isinstance(message, AIMessage):
            if message.content:
                history.append(
                    {
                        "role": "assistant",
                        "content": message.content,
                    }
                )

    session["chat_history"] = history
    session.modified = True


def extract_ai_response(messages):
    """
    Extract the latest useful AI response from the LangGraph messages.
    """

    for message in reversed(messages):

        if isinstance(message, AIMessage):

            content = message.content

            if isinstance(content, str) and content.strip():
                return content.strip()

            if isinstance(content, list):
                text_parts = []

                for item in content:
                    if isinstance(item, dict):
                        text = item.get("text")

                        if text:
                            text_parts.append(str(text))

                if text_parts:
                    return "\n".join(text_parts).strip()

    return "I'm sorry, I couldn't generate a response."


# -----------------------------------------------------------------------------
# Pages
# -----------------------------------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return render_template("home.html")


@app.route("/chat", methods=["GET"])
def chat():
    return render_template("chatbot.html")


# -----------------------------------------------------------------------------
# API
# -----------------------------------------------------------------------------

@app.route("/api/chat", methods=["POST"])
def chat_api():

    try:

        # ---------------------------------------------------------------------
        # Validate request
        # ---------------------------------------------------------------------

        if not request.is_json:
            return jsonify(
                {
                    "success": False,
                    "error": "Request must contain JSON data.",
                }
            ), 415

        data = request.get_json(silent=True)

        if not isinstance(data, dict):
            return jsonify(
                {
                    "success": False,
                    "error": "Invalid request body.",
                }
            ), 400

        user_input = data.get("message")

        if not isinstance(user_input, str):
            return jsonify(
                {
                    "success": False,
                    "error": "Message must be a string.",
                }
            ), 400

        user_input = user_input.strip()

        if not user_input:
            return jsonify(
                {
                    "success": False,
                    "error": "Message cannot be empty.",
                }
            ), 400

        # Prevent excessively large chat messages
        if len(user_input) > 2000:
            return jsonify(
                {
                    "success": False,
                    "error": "Message is too long. Please keep it under 2000 characters.",
                }
            ), 400

        # ---------------------------------------------------------------------
        # Get conversation history
        # ----------------------------------------------------------------------------------------------------------------------------------------

        history = get_chat_history()

        # Keep the conversation small enough for the Groq token limit.
        # Only the most recent messages are sent to the model.
        MAX_HISTORY_MESSAGES = 8
        MAX_HISTORY_CHARS = 18000

        # Add current user message
        history.append(
            HumanMessage(content=user_input)
        )

        # Keep only the latest messages
        history = history[-MAX_HISTORY_MESSAGES:]

        # Additional protection against very large messages
        limited_history = []
        total_chars = 0

        for message in reversed(history):

            content = getattr(message, "content", "") or ""

            if not isinstance(content, str):
                content = str(content)

            if total_chars + len(content) > MAX_HISTORY_CHARS:
                break

            limited_history.insert(0, message)
            total_chars += len(content)

        history = limited_history

        # ---------------------------------------------------------------------
        # Run LangGraph
        # ---------------------------------------------------------------------

        result = dental_graph.invoke(
            {
                "messages": history,
            },
            config={
                "recursion_limit": 20,
            },
        )

        final_messages = result.get("messages", [])

        # ---------------------------------------------------------------------
        # Extract response
        # ---------------------------------------------------------------------

        assistant_response = extract_ai_response(final_messages)

        # ---------------------------------------------------------------------
        # Save conversation
        # ---------------------------------------------------------------------

        save_chat_history(final_messages)

        return jsonify(
            {
                "success": True,
                "response": assistant_response,
            }
        ), 200

    except Exception as exc:

        # Log the actual error server-side
        app.logger.exception(
            "Error while processing dental appointment request"
        )

        # Don't expose internal stack traces or implementation details
        # to the client.
        return jsonify(
            {
                "success": False,
                "error": "Something went wrong while processing your request. Please try again.",
            }
        ), 500


# -----------------------------------------------------------------------------
# Clear Conversation
# -----------------------------------------------------------------------------

@app.route("/api/clear-chat", methods=["POST"])
def clear_chat():

    session.pop("chat_history", None)

    return jsonify(
        {
            "success": True,
            "message": "Chat history cleared.",
        }
    ), 200


# -----------------------------------------------------------------------------
# Health Check
# -----------------------------------------------------------------------------

@app.route("/health", methods=["GET"])
def health():

    return jsonify(
        {
            "status": "healthy",
            "service": "Dental Appointment Management System",
        }
    ), 200


# -----------------------------------------------------------------------------
# Error Handlers
# -----------------------------------------------------------------------------

@app.errorhandler(404)
def page_not_found(error):

    if request.path.startswith("/api/"):
        return jsonify(
            {
                "success": False,
                "error": "API endpoint not found.",
            }
        ), 404

    return render_template("home.html"), 404


@app.errorhandler(405)
def method_not_allowed(error):

    if request.path.startswith("/api/"):
        return jsonify(
            {
                "success": False,
                "error": "HTTP method not allowed.",
            }
        ), 405

    return jsonify(
        {
            "success": False,
            "error": "Method not allowed.",
        }
    ), 405


@app.errorhandler(413)
def request_too_large(error):

    return jsonify(
        {
            "success": False,
            "error": "Request is too large.",
        }
    ), 413


# -----------------------------------------------------------------------------
# Local Development
# -----------------------------------------------------------------------------

if __name__ == "__main__":

    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("PORT", os.getenv("FLASK_PORT", "5000")))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"

    app.run(
        host=host,
        port=port,
        debug=debug,
    )