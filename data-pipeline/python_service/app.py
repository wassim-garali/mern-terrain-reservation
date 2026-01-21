from flask import Flask, jsonify, request
from ai_insights import generate_insights
from extract_kpi import get_kpi

app = Flask(__name__)

@app.route("/ai", methods=["GET", "POST"])
def ai_route():
    try:
        # Si l'utilisateur envoie une question via POST
        if request.method == "POST":
            data = request.get_json()
            question = data.get("question")
            kpi = get_kpi()
            insight = generate_insights(kpi=kpi, question=question)


        else:
            # GET → génération automatique à partir des KPI
            kpi = get_kpi()
            insight = generate_insights(kpi=kpi)

        return jsonify({"insight": insight})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001)
