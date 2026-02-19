import { lobby } from './../../types';
import { Router } from '@angular/router';
import { Component, signal } from '@angular/core';
import { WebSocketService } from '../../services/websocket';
import { GlobalStore } from '../../services/globals';
import { Lobby } from './lobby/lobby';
import { NewLobby } from './new-lobby/new-lobby';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-waiting-room',
    imports: [NewLobby, Lobby, ReactiveFormsModule],
    templateUrl: './waiting-room.html',
    styleUrl: './waiting-room.css',
})
export class WaitingRoom {
    constructor(
        private wsService: WebSocketService,
        public globalStore: GlobalStore,
        private router: Router,
    ) {}

    lobbies = signal<lobby[]>([]);

    ngOnInit() {
        if (this.globalStore.getUsername() == '') {
            this.router.navigateByUrl('/');
        }

        this.wsService.getMessages().subscribe({
            next: (msg) => {
                switch (msg.type) {
                    case 'waiting_room_entered':
                        break;
                    case 'lobby_created':
                        this.globalStore.setLobbyId(msg.payload.lobby_id);
                        this.router.navigateByUrl('/lobby/' + msg.payload.lobby_id);
                        break;
                    case 'new_lobby':
                        this.addLobby(msg.payload);
                        break;
                }
            },
        });
    }

    addLobby(lobby: lobby) {
        this.lobbies.set([...this.lobbies(), lobby]);
    }
}
