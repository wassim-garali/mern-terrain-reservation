# python_service/ai_insights.py
import requests
import json
from extract_kpi import get_kpi

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"

def generate_insights(kpi=None, question=None):
    if not kpi:
        kpi = get_kpi()

    prompt = f"""
Tu es un assistant BI décisionnel.

KPI :
- Total réservations : {kpi['total_reservations']}
- Revenu total : {kpi['total_revenue']} DT
- Sport le plus réservé : {kpi['top_sport']}
- Durée moyenne : {kpi['average_duration']} h

Question :
{question or "Analyse globale"}

Réponds directement avec une interprétation métier et une recommandation.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": True
        },
        stream=True,
        timeout=300
    )

    full_response = ""

    for line in response.iter_lines():
        if line:
            data = json.loads(line.decode("utf-8"))
            if "response" in data:
                full_response += data["response"]
            if data.get("done"):
                break

    return full_response.strip()
