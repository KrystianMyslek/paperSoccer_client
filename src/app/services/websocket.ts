import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private player_id: string = '';
    private phantom_player_id: string | null = localStorage.getItem('player_id');
    private server_url = environment.serverURL || 'ws://localhost:8080';
    private socket$: WebSocketSubject<any>;

    constructor() {
        this.socket$ = webSocket(this.server_url);

        this.socket$.subscribe({
            next: (msg) => {
                if (msg.type == 'open' && msg.payload && msg.payload.id) {
                    this.player_id = msg.payload.id;

                    setTimeout(() => {
                        localStorage.setItem('player_id', this.player_id);
                    }, 1000);
                }
            },
        });
    }

    getMessages(): Observable<any> {
        return this.socket$.asObservable();
    }

    sendMessage(controller: string, action: string, payload?: any) {
        payload = { id: this.player_id, ...payload };
        this.socket$.next({ controller, action, payload });
    }

    sendPhantomMessage(controller: string, action: string, payload?: any) {
        payload = { id: this.phantom_player_id, ...payload };
        this.socket$.next({ controller, action, payload });
    }

    closeConnection() {
        this.socket$.complete();
    }
}
