# RoadVision AI: Smart Pothole Detection System

A real-time road monitoring system. A Raspberry Pi 5 runs a YOLOv11n model to detect potholes, tags each detection with GPS coordinates and sends it to a FastAPI backend. A React dashboard shows every pothole on a live map, with analytics and status tracking for road maintenance teams.

**Final Year Project, UC TATI.** Gold medal at MPI26. Published in IJSET Vol. 1 (2026).

## How it works

```
Raspberry Pi 5 (YOLOv11n + LC76G GPS)
        │  HTTP POST /add-pothole (image, latitude, longitude, severity)
        ▼
FastAPI backend ──► MySQL
        │  Nominatim reverse geocoding (coordinates → place name)
        ▼
REST API  ◄── Axios ──  React dashboard (map, analytics, admin)
```

## Features

- **Live detection feed** from the edge device
- **GPS map** (Leaflet + OpenStreetMap) with markers coloured by severity
- **Reverse geocoding**: converts latitude and longitude into a readable location name using the Nominatim API
- **Three-level severity**: Minor, Moderate and Critical, based on bounding box coverage
- **Analytics page** with charts (Recharts)
- **Admin status tracking**: update or delete each reported pothole
- **Image upload and storage** for every detection

## Tech stack

| Layer | Technology |
| --- | --- |
| Edge AI | Raspberry Pi 5, YOLOv11n, LC76G GNSS |
| Backend | Python, FastAPI, SQLAlchemy, MySQL, geopy (Nominatim) |
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, React-Leaflet, Recharts |

## API endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/dashboard-stats` | Summary counts for the dashboard |
| GET | `/potholes` | List all detected potholes |
| POST | `/add-pothole` | Add a detection (image + form data) |
| PUT | `/update-status/{id}` | Update a pothole's repair status |
| DELETE | `/delete-pothole/{id}` | Delete a pothole record |

Interactive API docs are available at `http://127.0.0.1:8000/docs` when the backend is running.

## Getting started

### 1. Database
Create a MySQL database named `smart_pothole_system` and import `database/schema.sql`.

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Simulate the edge device (optional)
```bash
cd backend
python raspberry_pi_simulator.py
```
This sends sample detections to the API, so the dashboard can be tested without the Raspberry Pi.

## Model performance

- Trained on 6,613 annotated images for 100 epochs
- mAP@0.5: **80.8%**, F1-score: **0.77**

## Future improvements

- Move authentication to the backend with JWT and hashed passwords (the current login is a prototype)
- Read the API URL from an environment variable instead of hardcoding it
- Deploy the backend and database to a cloud server

## Author

Muhammad Muttaqin bin Zainal
