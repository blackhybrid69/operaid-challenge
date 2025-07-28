import * as mqtt from 'mqtt';
import * as WebSocket from 'ws';

// In-Memory-Speicher für Nachrichten (Bonus: Fallback-Buffer, speichert letzte 5 Min. pro Maschine/Index)
interface Message {
    machineId: string;
    scrapIndex: number;
    value: number;
    timestamp: Date;
}

const messagesBuffer: { [key: string]: Message[] } = {}; // Key: `${machineId}-${scrapIndex}`

const mqttClient = mqtt.connect('mqtt://localhost:1883');
const wsServer = new WebSocket.Server({ port: 8080 });

// Funktion: MQTT-Verbindung herstellen und abonnieren
// Kommentar: Diese Funktion verbindet sich mit dem MQTT-Broker, abonniert das Topic und verarbeitet eingehende Nachrichten.
function connectToMqtt() {
    mqttClient.on('connect', () => {
        console.log('Verbunden mit MQTT-Broker');
        mqttClient.subscribe('machines/+/scrap', (err) => {
            if (err) console.error('Abonnement-Fehler:', err);
        });
    });

    mqttClient.on('message', (topic, message) => {
        const payload = JSON.parse(message.toString());
        console.log('Empfangene Nachricht:', payload); // nur zu lokalen testzwecken
        const machineId = payload.machineId;
        const scrapIndex = payload.scrapIndex;
        const value = payload.value;
        const timestamp = new Date(payload.timestamp);

        const key = `${machineId}-${scrapIndex}`;
        if (!messagesBuffer[key]) messagesBuffer[key] = [];
        messagesBuffer[key].push({ machineId, scrapIndex, value, timestamp });

        // Buffer bereinigen: Nur letzte 5 Min. behalten (Bonus: Fallback)
        const now = new Date();
        messagesBuffer[key] = messagesBuffer[key].filter(n => now.getTime() - n.timestamp.getTime() < 5 * 60 * 1000);

        // Aggregation berechnen und an WS-Clients senden
        const aggregation = calculateAggregation(key);
        sendToWebSocketClients(aggregation);
    });
}

// Funktion: Aggregation berechnen (Summe und Durchschnitt letzte 60 Sek.)
// Kommentar: Berechnet Summe und Durchschnitt der Werte für die letzten 60 Sekunden pro Maschine und Index. Handhabt mehrere Maschinen parallel (Bonus).
function calculateAggregation(key: string): any {
    const now = new Date();
    const last60Seconds = messagesBuffer[key].filter(n => now.getTime() - n.timestamp.getTime() < 60 * 1000);
    if (last60Seconds.length === 0) return null;

    const sum = last60Seconds.reduce((acc, n) => acc + n.value, 0);
    const average = sum / last60Seconds.length;

    return {
        machineId: key.split('-')[0],
        scrapIndex: parseInt(key.split('-')[1]),
        sumLast60s: sum,
        avgLast60s: average.toFixed(2),
        timestamp: now.toISOString()
    };
}

// Funktion: Updates an WebSocket-Clients senden
// Kommentar: Sendet die aggregierten Daten an alle verbundenen Frontend-Clients. Unterstützt mehrere Clients (für Skalierbarkeit).
function sendToWebSocketClients(data: any) {
    if (!data) return;
    wsServer.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// WebSocket-Verbindungen handhaben
// Kommentar: Richtet den WebSocket-Server ein und loggt Verbindungen (einschließlich Fehlerbehandlung).
wsServer.on('connection', (ws) => {
    console.log('Neuer WebSocket-Client verbunden');
    ws.on('error', console.error);
});

connectToMqtt();
console.log('Backend läuft: WebSocket auf Port 8080');