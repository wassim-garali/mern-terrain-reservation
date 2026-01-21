# etl_dw.py
import pandas as pd
from pymongo import MongoClient
from sqlalchemy import create_engine, text

# -------------------------------
# Extraction depuis MongoDB
# -------------------------------
def extract_data():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["locationTerrainDB"]

    users_df = pd.DataFrame(list(db.users.find()))
    terrains_df = pd.DataFrame(list(db.terrains.find()))
    reservations_df = pd.DataFrame(list(db.reservations.find()))

    return users_df, terrains_df, reservations_df

# -------------------------------
# Transformation
# -------------------------------
def transform_users(df):
    df = df[["_id", "name", "email", "role"]].copy()
    df["_id"] = df["_id"].astype(str)
    df.rename(columns={"_id": "user_id"}, inplace=True)
    return df.drop_duplicates(subset=["user_id"])

def transform_terrains(df):
    df = df[["_id", "name", "sport", "capacity", "location", "pricePerHour"]].copy()
    df["_id"] = df["_id"].astype(str)
    df.rename(columns={"_id": "terrain_id", "pricePerHour": "price_per_hour"}, inplace=True)
    return df.drop_duplicates(subset=["terrain_id"])

def transform_dates(df):
    df = df[["date"]].drop_duplicates().copy()
    df["date"] = pd.to_datetime(df["date"])
    df["year"] = df["date"].dt.year
    df["month"] = df["date"].dt.month
    df["day"] = df["date"].dt.day
    df.rename(columns={"date": "date_id"}, inplace=True)
    return df

def transform_reservations(df):
    df = df[["_id", "user", "terrain", "date", "durationHours", "totalPrice"]].copy()
    df["_id"] = df["_id"].astype(str)
    df["user"] = df["user"].astype(str)
    df["terrain"] = df["terrain"].astype(str)
    df["date"] = pd.to_datetime(df["date"])
    df.rename(columns={
        "_id": "reservation_id",
        "user": "user_id",
        "terrain": "terrain_id",
        "durationHours": "duration_hours",
        "totalPrice": "total_price",
        "date": "date_id"
    }, inplace=True)
    return df

# -------------------------------
# Chargement vers PostgreSQL
# -------------------------------
DB_URI = "postgresql+psycopg2://postgres:postgress@localhost:5432/locationDWH"
engine = create_engine(DB_URI)

def load_table(df, table_name):
    if not df.empty:
        df.to_sql(table_name, engine, if_exists="append", index=False)

# -------------------------------
# Truncate tables dans le bon ordre
# -------------------------------
def truncate_tables():
    with engine.begin() as conn:
        # On vide la table FACT en premier
        conn.execute(text("TRUNCATE TABLE fact_reservations CASCADE"))
        # Puis les tables DIMENSIONS
        conn.execute(text("TRUNCATE TABLE dim_date CASCADE"))
        conn.execute(text("TRUNCATE TABLE dim_user CASCADE"))
        conn.execute(text("TRUNCATE TABLE dim_terrain CASCADE"))

# -------------------------------
# ETL complet (scheduler friendly)
# -------------------------------
def run_etl():
    try:
        print("🚀 Démarrage ETL...")

        users_df, terrains_df, reservations_df = extract_data()

        if reservations_df.empty:
            print("⚠️ Aucune donnée à traiter")
            return

        users_df = transform_users(users_df)
        terrains_df = transform_terrains(terrains_df)
        dates_df = transform_dates(reservations_df)
        reservations_df = transform_reservations(reservations_df)

        # Nettoyage des tables
        truncate_tables()

        # Charger les DIMENSIONS
        load_table(dates_df, "dim_date")
        load_table(users_df, "dim_user")
        load_table(terrains_df, "dim_terrain")

        # Sécuriser les clés étrangères
        reservations_df = reservations_df[
            reservations_df["terrain_id"].isin(terrains_df["terrain_id"]) &
            reservations_df["user_id"].isin(users_df["user_id"])
        ]

        # Charger la FACT
        load_table(reservations_df, "fact_reservations")

        print("🎉 ETL terminé avec succès")

    except Exception as e:
        print("❌ Erreur ETL :", e)

# -------------------------------
# Exécution
# -------------------------------
if __name__ == "__main__":
    run_etl()
