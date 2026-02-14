import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private client_id: string = '';
    private server_url = environment.serverURL || 'ws://localhost:8080';
    private socket$: WebSocketSubject<any>;

    constructor() {
        this.socket$ = webSocket(this.server_url);

        this.socket$.subscribe({
            next: (msg) => {
                if (msg.type == 'open' && msg.payload && msg.payload.id) {
                    this.client_id = msg.payload.id;
                }
            },
        });
    }

    getMessages(): Observable<any> {
        return this.socket$.asObservable();
    }

    sendMessage(action: string, payload?: any) {
        payload = { id: this.client_id, ...payload };
        this.socket$.next({ action, payload });
    }

    closeConnection() {
        this.socket$.complete();
    }
}
