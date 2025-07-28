import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class Websocket {
  private socket$!: WebSocketSubject<any>;
  public dataStream = new Subject<any>();

  // Funktion: Mit WebSocket verbinden
  // Kommentar: Stellt Verbindung zum Backend-WebSocket her und streamt Daten.
  connect() {
    this.socket$ = webSocket('ws://localhost:8080');
    this.socket$.subscribe(
      (data) => {
        console.log('WebSocket-Daten empfangen:', data); // Log für Debugging
        this.dataStream.next(data);
      },
      (err) => console.error('WebSocket-Fehler:', err)
    );
  }
}