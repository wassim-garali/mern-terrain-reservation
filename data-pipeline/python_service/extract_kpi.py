import pandas as pd
from sqlalchemy import create_engine

def get_kpi():
    engine = create_engine(
        "postgresql+psycopg2://postgres:postgress@localhost:5432/locationDWH"
    )

    # 🔹 KPI principaux
    main_kpi_query = """
    SELECT 
        COUNT(*) AS total_reservations,
        SUM(total_price) AS total_revenue,
        AVG(duration_hours) AS average_duration
    FROM fact_reservations
    """
    df = pd.read_sql(main_kpi_query, engine)

    # 🔹 Répartition des réservations par sport
    sports_query = """
    SELECT t.sport, COUNT(*) AS reservations
    FROM fact_reservations f
    JOIN dim_terrain t ON f.terrain_id = t.terrain_id
    GROUP BY t.sport
    ORDER BY reservations DESC
    """
    sports_df = pd.read_sql(sports_query, engine)

    # 🔹 Top sport
    top_sport = sports_df.iloc[0]["sport"]

    kpi = {
        "total_reservations": int(df.iloc[0]["total_reservations"]),
        "total_revenue": float(df.iloc[0]["total_revenue"]),
        "average_duration": float(df.iloc[0]["average_duration"]),
        "top_sport": top_sport,
        "sport_distribution": sports_df.to_dict(orient="records")
    }

    return kpi


# 🔎 Test local
if __name__ == "__main__":
    from pprint import pprint
    pprint(get_kpi())
