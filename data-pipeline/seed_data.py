from pymongo import MongoClient
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

# 🔌 Connexion MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["locationTerrainDB"]

users_col = db.users
terrains_col = db.terrains
reservations_col = db.reservations

# 🧹 Nettoyage (optionnel)
users_col.delete_many({})
terrains_col.delete_many({})
reservations_col.delete_many({})

# -------------------------------
# 1️⃣ Générer des USERS
# -------------------------------
users = []
for i in range(50):
    user = {
        "name": fake.name(),
        "email": fake.unique.email(),
        "password": "hashedpassword",  # OK pour data BI
        "role": "user",
        "reservations": [],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }
    users.append(user)

users_col.insert_many(users)
users = list(users_col.find())

print("✅ Users générés")

# -------------------------------
# 2️⃣ Générer des TERRAINS
# -------------------------------
sports = ["foot", "basket", "tennis", "padel"]
locations = ["Tunis", "Ariana", "Sousse", "Sfax"]

terrains = []
for i in range(40):
    terrain = {
        "name": f"Terrain {i+1}",
        "sport": random.choice(sports),
        "capacity": random.choice([2, 4, 6, 10]),
        "pricePerHour": random.randint(20, 80),
        "location": random.choice(locations),
        "isAvailable": True,
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }
    terrains.append(terrain)

terrains_col.insert_many(terrains)
terrains = list(terrains_col.find())

print("✅ Terrains générés")

# -------------------------------
# 3️⃣ Générer des RÉSERVATIONS
# -------------------------------
def random_time():
    start = random.randint(8, 20)
    duration = random.choice([1, 2])
    return start, start + duration

reservations = []

for _ in range(2000):
    terrain = random.choice(terrains)
    user = random.choice(users)

    start_hour, end_hour = random_time()
    date = fake.date_between(start_date="-90d", end_date="+30d")

    duration = end_hour - start_hour
    total_price = duration * terrain["pricePerHour"]

    reservation = {
        "user": user["_id"],
        "terrain": terrain["_id"],
        "date": str(date),
        "startTime": f"{start_hour}:00",
        "endTime": f"{end_hour}:00",
        "durationHours": duration,
        "totalPrice": total_price,
        "sport": terrain["sport"],
        "terrainName": terrain["name"],
        "createdAt": datetime.now(),
        "updatedAt": datetime.now()
    }

    reservations.append(reservation)

reservations_col.insert_many(reservations)

print("✅ Réservations générées")
print("🎉 DATASET PRÊT POUR BI & IA")
