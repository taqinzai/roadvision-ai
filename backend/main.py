from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine
import shutil
import os
from geopy.geocoders import Nominatim

app = FastAPI()

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Pydantic Model
# =========================

class PotholeData(BaseModel):

    image_url: str

    location_name: str

    latitude: float

    longitude: float

    severity: str

    status: str

# =========================
# Home API
# =========================

@app.get("/")
def home():

    return {
        "message": "Smart Pothole Monitoring API Running"
    }

# =========================
# Get All Potholes
# =========================
@app.get("/dashboard-stats")
def dashboard_stats():

    with engine.connect() as connection:

        total = connection.execute(
            text(
                """
                SELECT COUNT(*)
                FROM pothole_reports
                """
            )
        ).scalar()

        pending = connection.execute(
            text(
                """
                SELECT COUNT(*)
                FROM pothole_reports
                WHERE status='Pending'
                """
            )
        ).scalar()

        in_progress = connection.execute(
            text(
                """
                SELECT COUNT(*)
                FROM pothole_reports
                WHERE status='In Progress'
                """
            )
        ).scalar()

        resolved = connection.execute(
            text(
                """
                SELECT COUNT(*)
                FROM pothole_reports
                WHERE status='Resolved'
                """
            )
        ).scalar()

        return {

            "total": total,

            "pending": pending,

            "in_progress": in_progress,

            "resolved": resolved

        }

@app.get("/potholes")
def get_potholes():

    with engine.connect() as connection:

        result = connection.execute(
            text("SELECT * FROM pothole_reports")
        )

        potholes = []

        for row in result:

            potholes.append({

                "id": row.id,

                "image_url": row.image_url,

                "location_name": row.location_name,

                "latitude": row.latitude,

                "longitude": row.longitude,

                "severity": row.severity,

                "detected_time": str(row.detected_time),

                "status": row.status

            })

        return potholes

@app.post("/add-pothole")
def add_pothole(

    image: UploadFile = File(...),

    location_name: str = Form(...),

    latitude: float = Form(...),

    longitude: float = Form(...),

    severity: str = Form(...),

    status: str = Form(...),

):

    os.makedirs("uploads", exist_ok=True)

    image_path = f"uploads/{image.filename}"

    with open(image_path, "wb") as buffer:

        shutil.copyfileobj(
            image.file,
            buffer
        )

    try:

        geolocator = Nominatim(
            user_agent="smart_pothole_system"
        )

        location = geolocator.reverse(
            f"{latitude}, {longitude}",
            language="en"
        )

        if location:

            address_parts = location.address.split(",")

            if len(address_parts) >= 4:

                location_name = (
                    f"{address_parts[-4].strip()}, "
                    f"{address_parts[-3].strip()}"
                )

            else:

                location_name = location.address

    except Exception as e:

        print("Location Error:", e)

    with engine.connect() as connection:

        connection.execute(

            text(
                """
                INSERT INTO pothole_reports
                (
                    image_url,
                    location_name,
                    latitude,
                    longitude,
                    severity,
                    detected_time,
                    status
                )
                VALUES
                (
                    :image_url,
                    :location_name,
                    :latitude,
                    :longitude,
                    :severity,
                    NOW(),
                    :status
                )
                """
            ),

            {
                "image_url": image.filename,
                "location_name": location_name,
                "latitude": latitude,
                "longitude": longitude,
                "severity": severity,
                "status": status,
            }

        )

        connection.commit()

    return {

        "message": "Real pothole uploaded successfully"

    }
    
@app.put("/update-status/{pothole_id}")
def update_status(

    pothole_id: int,

    status: str = Form(...)

):

    with engine.connect() as connection:

        connection.execute(

            text(
                """
                UPDATE pothole_reports
                SET status = :status
                WHERE id = :id
                """
            ),

            {
                "status": status,
                "id": pothole_id
            }

        )

        connection.commit()

    return {

        "message": "Status updated successfully"

    }

@app.delete("/delete-pothole/{pothole_id}")
def delete_pothole(pothole_id: int):

    with engine.connect() as connection:

        result = connection.execute(
            text(
                """
                SELECT image_url
                FROM pothole_reports
                WHERE id = :id
                """
            ),
            {
                "id": pothole_id
            }
        ).fetchone()

        if result is None:

            return {

                "message": "Pothole record not found"

            }

        image_filename = os.path.basename(result.image_url)

        connection.execute(
            text(
                """
                DELETE FROM pothole_reports
                WHERE id = :id
                """
            ),
            {
                "id": pothole_id
            }
        )

        connection.commit()

    image_path = os.path.join(
        "uploads",
        image_filename
    )

    if os.path.exists(image_path):

        os.remove(image_path)

    return {

        "message": "Pothole record and image deleted successfully"

    }
    
def add_pothole(

    image: UploadFile = File(...),

    location_name: str = Form(...),

    latitude: float = Form(...),

    longitude: float = Form(...),

    severity: str = Form(...),

    status: str = Form(...),

):

    # Create uploads folder
    os.makedirs("uploads", exist_ok=True)

    # Save image
    image_path = f"uploads/{image.filename}"

    with open(image_path, "wb") as buffer:

        shutil.copyfileobj(
            image.file,
            buffer
        )
    
        # Convert GPS to location name

    try:

        geolocator = Nominatim(
            user_agent="smart_pothole_system"
        )

        location = geolocator.reverse(
            f"{latitude}, {longitude}",
            language="en"
        )

        if location:

            address_parts = location.address.split(",")

            if len(address_parts) >= 3:

                location_name = (
                    f"{address_parts[-4].strip()}, "
                    f"{address_parts[-3].strip()}"
                )

            else:

                location_name = location.address

    except Exception as e:

        print("Location Error:", e)
    
    with engine.connect() as connection:

        connection.execute(

            text(
                """
                INSERT INTO pothole_reports
                (
                    image_url,
                    location_name,
                    latitude,
                    longitude,
                    severity,
                    detected_time,
                    status
                )

                VALUES
                (
                    :image_url,
                    :location_name,
                    :latitude,
                    :longitude,
                    :severity,
                    NOW(),
                    :status
                )
                """
            ),

            {
                "image_url": image.filename,
                "location_name": location_name,
                "latitude": latitude,
                "longitude": longitude,
                "severity": severity,
                "status": status,
            }

        )

        connection.commit()

    return {

        "message":
        "Real pothole uploaded successfully"

    }
