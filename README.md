# 🦷 DentAgent AI

### Intelligent Dental Appointment Management System powered by LangGraph & Groq GPT-OSS 20B

DentAgent AI is an AI-powered dental appointment management system that uses **LangGraph, LangChain, and Groq GPT-OSS 20B** to provide a conversational interface for managing dental appointments.

The project contains **two separate application entry points**:

- `main.py` → **Streamlit application**
- `app.py` → **Flask web application**

Both applications use the same dental-agent backend and appointment-management tools.

---

## ✨ Features

- 🤖 AI-powered dental appointment assistant
- 🧠 LangGraph-based agent workflow
- ⚡ Groq GPT-OSS 20B
- 👨‍⚕️ Find dentists by specialization
- 📅 Check available appointment slots
- 📌 Book appointments
- ❌ Cancel appointments
- 🔄 Reschedule appointments
- 📋 View patient appointments
- 💬 Natural-language interaction
- 🖥️ Streamlit application for interactive demos
- 🌐 Flask application for web deployment
- 📊 CSV-based doctor availability
- 🔐 Environment-variable based API configuration
- 🚀 Gunicorn support for production deployment

---

# 🏗️ Project Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             ┌─────────────┐                 ┌─────────────┐
             │  Streamlit  │                 │    Flask    │
             │   main.py   │                 │   app.py    │
             └──────┬──────┘                 └──────┬──────┘
                    │                               │
                    └───────────────┬───────────────┘
                                    ▼
                         ┌─────────────────────┐
                         │   Dental AI Agent   │
                         │      LangGraph      │
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │  Groq GPT-OSS 20B   │
                         └──────────┬──────────┘
                                    ▼
                         ┌─────────────────────┐
                         │ Appointment Tools   │
                         └──────────┬──────────┘
                                    ▼
                     doctor_availability.csv
```

---

# 📂 Project Structure

```text
DentAgentAI/
│
├── dental_agent/
│   ├── __init__.py
│   ├── agent.py
│   ├── tools.py
│   └── ...
│
├── templates/
│   └── ...
│
├── static/
│   └── ...
│
├── doctor_availability.csv
│
├── main.py                 # Streamlit application
├── app.py                  # Flask application
│
├── requirements.txt
├── README.md
├── .gitignore
└── .env                    # Local only - DO NOT commit
```

---

# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| LangChain | LLM and tool integration |
| LangGraph | Agent orchestration |
| Groq | LLM inference |
| GPT-OSS 20B | AI language model |
| Streamlit | Interactive application |
| Flask | Web application |
| Pandas | Data processing |
| python-dotenv | Environment configuration |
| Gunicorn | Production WSGI server |

---

# 🤖 AI Agent Capabilities

DentAgent AI supports natural-language appointment management.

### Find available dentists

```text
Show available slots for an orthodontist.
```

### Book an appointment

```text
Book patient 1000082 with Emily Johnson on 5/10/2026 at 9:00.
```

### Cancel an appointment

```text
Cancel the appointment for patient 1000082 at 5/10/2026 9:00.
```

### Reschedule an appointment

```text
Reschedule patient 1000082 from 5/10/2026 9:00 to 5/12/2026 10:00.
```

### Check patient appointments

```text
What appointments does patient 1000048 have?
```

The LangGraph agent interprets the user's request and calls the appropriate appointment-management tool.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/Mohit01112/DentAgent-AI.git
cd DentAgent-AI
```

## 2. Create a virtual environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
MODEL_NAME=openai/gpt-oss-20b
```

Do not commit `.env` to GitHub.

Recommended `.gitignore`:

```gitignore
venv/
.env
__pycache__/
*.pyc
```

---

# 🖥️ Streamlit Application

The Streamlit application is implemented in:

```text
main.py
```

Run it using:

```bash
streamlit run main.py
```

The application will normally be available at:

```text
http://localhost:8501
```

The Streamlit version is useful for:

- AI-agent demonstrations
- Interactive testing
- Local development
- Rapid prototyping

---

# 🌐 Flask Application

The Flask application is implemented in:

```text
app.py
```

Run locally with:

```bash
python app.py
```

The Flask application will normally be available at:

```text
http://127.0.0.1:5000
```

The Flask version provides a web-based interface and is the version intended for production-style deployment.

---

# 🚀 Deploying the Flask Application on Render

The Flask application can be deployed using Render.

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
gunicorn app:app
```

> `app:app` means `app.py` contains the Flask instance named `app`.

For example:

```python
from flask import Flask

app = Flask(__name__)
```

---

## Render Environment Variables

Add the following environment variable in the Render dashboard:

```text
GROQ_API_KEY=your_groq_api_key
```

If your application reads the model name from the environment, also add:

```text
MODEL_NAME=openai/gpt-oss-20b
```

Do not place API keys directly inside the source code.

---

# 📋 Appointment Data

The project uses:

```text
doctor_availability.csv
```

to store doctor availability and appointment information.

The AI agent uses the appointment tools to interact with this data and perform operations such as:

- Checking availability
- Booking appointments
- Cancelling appointments
- Rescheduling appointments
- Finding doctors by specialization

---

# 🔄 Application Flow

```text
User Request
     │
     ▼
Streamlit (main.py)
       OR
Flask (app.py)
     │
     ▼
LangGraph Dental Agent
     │
     ▼
Groq GPT-OSS 20B
     │
     ▼
Determine Required Tool
     │
     ├── Find Doctor
     ├── Check Availability
     ├── Book Appointment
     ├── Cancel Appointment
     └── Reschedule Appointment
     │
     ▼
Appointment Data
     │
     ▼
AI Response
     │
     ▼
User
```

---

# 🔐 Security

Never commit sensitive credentials.

Make sure the following are included in `.gitignore`:

```gitignore
.env
venv/
__pycache__/
*.pyc
```

Use environment variables for API keys:

```python
import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
```

---

# 📦 Requirements

The project dependencies are maintained in:

```text
requirements.txt
```

Install them with:

```bash
pip install -r requirements.txt
```

---

# 🎯 Project Goals

DentAgent AI demonstrates how modern **agentic AI** can be combined with real-world appointment-management workflows.

The project focuses on:

- LLM-powered decision making
- Tool calling
- LangGraph orchestration
- Conversational AI
- Appointment automation
- Web application development
- Production-oriented deployment

---

# 👨‍💻 Author

**Mohit Jadhav**

B.E. Artificial Intelligence & Data Science

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**GitHub:**  
https://github.com/Mohit01112/DentAgent-AI
