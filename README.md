Hier ist die deutsche Version der Readme mit den gewünschten Anpassungen:

---

# OperAID Maschinen-Monitoring Dashboard

## Hauptfunktionen

### Kernfunktionalität
- Echtzeit-Datenvisualisierung über MQTT/WebSocket
- Parallele Verarbeitung mehrerer Maschinen (A1, A2 usw.)
- 60-Sekunden-Durchschnittsberechnung (Summe & Durchschnitt)

### Technische Fähigkeiten
- Temporärer Speicher der letzten 100 Datenpunkte pro Maschine
- Automatische Wiederverbindung bei Verbindungsabbruch
- Doppelte Filterung:
  * Nach Maschinen-ID
  * Nach Scrap-Index

### Visualisierungsoptionen
- Dynamische Diagrammtypen:
  * Balkendiagramme (Standard)
  * Liniendiagramme
  * Kuchendiagramme
- Farbkodierung nach Maschine
- Sortierbare Datentabelle

## Installation & Bedienung

### Installation
```bash
# Mosquitto (MQTT Broker)
sudo apt install mosquitto mosquitto-clients  # Linux
brew install mosquitto                        # Mac

# Backend (Node.js)
cd backend
npm install
npm start  # Port 3000

# Frontend (Angular)
cd frontend
npm install
ng serve  # Port 4200
```

### Testdaten senden
```bash
mosquitto_pub -h localhost -t "machines/A1/scrap" -m '{
  "machineId": "A1",
  "scrapIndex": 1, 
  "value": 5,
  "sumLast60s": 25,
  "avgLast60s": 3.5,
  "timestamp": "2025-07-30T12:00:00Z"
}'
```

## Systemarchitektur
```
MQTT Broker → Node.js Backend → WebSocket → Angular Frontend
```
