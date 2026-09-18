from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import AIMessage
from langgraph.prebuilt import ToolNode
from dental_agent.config.settings import GROQ_API_KEY, MODEL_NAME, TEMPERATURE
from dental_agent.models.state import AppointmentState
from dental_agent.tools.csv_reader import (
    get_available_slots,
    get_patient_appointments,
    check_slot_availability,
    list_doctors_by_specialization,
)
from dental_agent.utils import sanitize_messages

INFO_TOOLS = [
    get_available_slots,
    get_patient_appointments,
    check_slot_availability,
    list_doctors_by_specialization,
]

INFO_SYSTEM = """You are the Information Agent for a dental appointment system.

Your role is to answer queries about doctor availability, schedules, and appointment status.

## Available Tools
- get_available_slots(specialization, doctor_name, date_filter) — find open slots
- get_patient_appointments(patient_id) — look up a patient's bookings
- check_slot_availability(doctor_name, date_slot) — verify a specific slot
- list_doctors_by_specialization(specialization) — list doctors in a specialty

## Guidelines
1. Use tools to fetch real data. Never invent slot times or doctor names.
2. If the user has not provided enough parameters, ask a focused clarifying question.
3. Present results in a clear, friendly, numbered list.
4. NEVER use Markdown tables.
5. NEVER use "|" characters to create tables.
6. Keep appointment results clean and easy to read.
7. Do not repeat the same appointment.
8. Only show appointments returned by the tools.
9. Valid specializations: general_dentist, oral_surgeon, orthodontist, cosmetic_dentist, prosthodontist, pediatric_dentist, emergency_dentist.
10. After answering, ask if the user needs anything else.

## Appointment Display Format

When showing available appointments, use this format:

1. 7/8/2026 9:00 AM — Kevin Anderson
2. 7/8/2026 11:00 AM — Kevin Anderson
3. 7/8/2026 11:30 AM — Kevin Anderson

Do not use a table.

When showing a patient's appointments, use this format:

1. 5/8/2026 9:00 AM — John Doe — General Dentist
2. 6/8/2026 2:30 PM — Emily Johnson — General Dentist
3. 6/8/2026 10:30 AM — Lisa Brown — Cosmetic Dentist

Do not use a table.

## Date Format
All dates follow M/D/YYYY H:MM format (e.g., 5/10/2026 9:00).
"""

INFO_PROMPT = ChatPromptTemplate.from_messages([
    ("system", INFO_SYSTEM),
    ("placeholder", "{messages}"),
])

info_tool_node = ToolNode(tools=INFO_TOOLS)


def info_agent_node(state: AppointmentState) -> dict:
    llm = ChatGroq(
        api_key=GROQ_API_KEY,
        model=MODEL_NAME,
        temperature=TEMPERATURE,
    ).bind_tools(INFO_TOOLS)

    chain = INFO_PROMPT | llm
    response = chain.invoke({"messages": sanitize_messages(state["messages"])})
    return {
        "messages": [response],
        "final_response": response.content if not response.tool_calls else None,
    }