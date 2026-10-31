# 🦷 DentAgent AI

### Intelligent Dental Appointment Management System powered by LangGraph & Groq GPT-OSS 20B

<p align="center">
  <b>AI-Powered Multi-Agent Appointment Management System</b>
</p>

🌐 **Live Demo:** https://dentagent-ai.onrender.com/

💻 **GitHub:** https://github.com/Mohit01112/DentAgent-AI

---

## 📌 Project Overview

DentAgent AI is an AI-powered dental appointment management system that uses **LangGraph, LangChain, and Groq GPT-OSS 20B** to provide an intelligent conversational interface for managing dental appointments.

The system uses a multi-agent architecture to understand user requests, select the appropriate agent, and execute appointment-management operations through specialized tools.

The project contains two separate application entry points:

- `main.py` – Streamlit application for interactive demonstrations.
- `app.py` – Flask web application designed for web deployment.

Both applications use the same dental-agent backend and appointment-management tools.

## ✨ Features

- 🤖 AI-powered dental appointment assistant.
- 🧠 LangGraph-based multi-agent workflow.
- ⚡ Groq GPT-OSS 20B language model.
- 👨‍⚕️ Find dentists based on specialization.
- 📅 Check available appointment slots.
- 📌 Book dental appointments.
- ❌ Cancel existing appointments.
- 🔄 Reschedule appointments.
- 📋 Retrieve patient appointment details.
- 💬 Natural-language interaction.
- 🖥️ Streamlit application for interactive demonstrations.
- 🌐 Flask application for web deployment.
- 📊 CSV-based doctor availability and appointment data.
- 🔐 Environment-variable-based API configuration.
- 🚀 Gunicorn support for production deployment.

---

## 🏗️ Project Architecture

DentAgent AI follows a multi-agent architecture orchestrated using LangGraph.

The system supports two frontend applications that connect to a shared dental-agent backend.

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

## 🤖 AI Agent Capabilities

The system uses specialized agents to handle different appointment-management operations.

| Agent | Responsibility |
|---|---|
| Information Agent | Handles doctor and appointment-related enquiries |
| Booking Agent | Manages new appointment bookings |
| Cancellation Agent | Handles appointment cancellations |
| Rescheduling Agent | Manages appointment changes |
| Supervisor | Coordinates agent execution and workflow routing |

### How It Works

1. The user sends a natural-language request.
2. The LangGraph workflow receives the request.
3. The appropriate agent is selected based on the user's intent.
4. The agent invokes the required appointment-management tool.
5. The appointment dataset is retrieved or updated.
6. The system generates a response for the user.

---

## 💬 Example Interactions

### 1. Find Available Dentists

```text
Show available slots for an orthodontist.
```

### 2. Book an Appointment

```text
Book patient 1000082 with Emily Johnson
on 5/10/2026 at 9:00.
```

### 3. Cancel an Appointment

```text
Cancel the appointment for patient 1000082
at 5/10/2026 9:00.
```

### 4. Reschedule an Appointment

```text
Reschedule patient 1000082 from 5/10/2026 9:00
to 5/12/2026 10:00.
```

### 5. Retrieve Patient Appointments

```text
What appointments does patient 1000048 have?
```

The LangGraph agent interprets the request and invokes the appropriate appointment-management tool.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| LangChain | LLM and tool integration |
| LangGraph | Multi-agent orchestration |
| Groq API | LLM inference |
| GPT-OSS 20B | Language model |
| Streamlit | Interactive application |
| Flask | Web application |
| Pandas | Data processing |
| CSV | Appointment data storage |
| python-dotenv | Environment configuration |
| Gunicorn | Production WSGI server |
| HTML, CSS, JavaScript | Web frontend |

---

## 📂 Project Structure

```text
DentAgent-AI/
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

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Mohit01112/DentAgent-AI.git

cd DentAgent-AI
```

### 2. Create a Virtual Environment

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root directory.

```env
GROQ_API_KEY=your_groq_api_key
MODEL_NAME=openai/gpt-oss-20b
```

Get your API key from:

https://console.groq.com/

Make sure your environment variable names match those used in your project configuration.

**Important:** Never upload your `.env` file or API credentials to GitHub.

---

## 🖥️ Running the Streamlit Application

The Streamlit application is implemented in:

```text
main.py
```

Run:

```bash
streamlit run main.py
```

Open:

```text
http://localhost:8501
```

The Streamlit application is useful for:

- Interactive AI-agent demonstrations.
- Local development and testing.
- Experimenting with appointment workflows.
- Rapid prototyping.

---

## 🌐 Running the Flask Application

The Flask web application is implemented in:

```text
app.py
```

Run:

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

The Flask application provides a web-based interface and is the version used for the deployed live demo.

---

## 🚀 Deployment on Render

DentAgent AI's Flask application can be deployed using Render.

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
gunicorn app:app
```

Here, `app:app` refers to:

- First `app`: Python file `app.py`.
- Second `app`: Flask application instance named `app`.

### Environment Variables

Configure the following in the Render dashboard:

```env
GROQ_API_KEY=your_groq_api_key
MODEL_NAME=openai/gpt-oss-20b
```

Add any other environment variables required by your Flask configuration.

---

## 📊 Appointment Data Management

The application uses:

```text
doctor_availability.csv
```

The CSV dataset supports doctor availability and appointment-management operations.

The agent interacts with appointment tools to:

- Find doctors by specialization.
- Check available slots.
- Book appointments.
- Cancel appointments.
- Reschedule appointments.
- Retrieve patient appointment details.

---

## 🔐 Security

Security practices followed in the project include:

- Environment variables for API credentials.
- `.env` exclusion from version control.
- Separation of application configuration and source code.
- Avoiding hardcoded API keys.

Recommended `.gitignore`:

```gitignore
venv/
.env
__pycache__/
*.pyc
.streamlit/secrets.toml
```

---

## 🔮 Future Enhancements

DentAgent AI currently focuses on dental appointment management. The long-term vision is to expand this concept into a reusable **AI Booking Automation Platform**.

Planned enhancements:

- 📞 AI voice-calling agents for incoming booking enquiries.
- 🗣️ Natural voice conversations for appointment management.
- 🏥 Integration with hospitals and healthcare clinics.
- 🏨 Booking automation for hotels.
- 🍽️ Reservation automation for restaurants.
- 🔄 Real-time availability synchronization.
- 🗄️ Database integration for scalable data management.
- 🔔 Automated booking confirmations and notifications.

The goal is to make intelligent appointment automation adaptable to different booking-based businesses.

---

## 🎯 Project Goals

This project demonstrates the practical application of:

- Agentic AI and multi-agent systems.
- LLM-powered decision-making.
- Tool calling and function execution.
- LangGraph workflow orchestration.
- Conversational AI.
- Appointment workflow automation.
- Flask application development.
- AI application deployment.

**The vision: Move beyond AI that simply responds to AI that actually gets things done.**

---

## 👨‍💻 Author

**Mohit Jadhav**

B.E. – Artificial Intelligence and Data Science

East Point College of Engineering and Technology

- GitHub: https://github.com/Mohit01112
- LinkedIn: https://www.linkedin.com/in/mohit-jadhav-49734427b/

---

## ⭐ Support

If you find DentAgent AI interesting, consider giving the repository a ⭐ on GitHub.

Feedback, suggestions, and contributions are welcome!

