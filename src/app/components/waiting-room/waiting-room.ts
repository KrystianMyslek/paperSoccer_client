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
        if (this.globalStore.getPlayer().id == undefined) {
            this.router.navigateByUrl('/');
        }

        this.wsService.sendMessage('setup', 'getLobbiesList');

        this.wsService.getMessages().subscribe({
            next: (msg) => {
                switch (msg.type) {
                    case 'lobbies_list':
                        this.lobbies.set(msg.payload.lobbies);
                        break;
                    case 'lobby_created':
                        this.globalStore.setLobby(msg.payload.lobby);
                        this.router.navigateByUrl('/lobby/' + msg.payload.lobby.id);
                        break;
                    case 'lobby_joined':
                        this.globalStore.setLobby(msg.payload.lobby);
                        this.router.navigateByUrl('/lobby/' + msg.payload.lobby.id);
                        break;
                    case 'new_lobby':
                        this.addLobby(msg.payload.lobby);
                        break;
                    case 'lobby_destroyed':
                        this.removeLobby(msg.payload.lobby_id);
                        break;
                }
            },
        });
    }

    addLobby(lobby: lobby) {
        this.lobbies.set([...this.lobbies(), lobby]);
    }

    removeLobby(lobby_id: string) {
        this.lobbies.set(this.lobbies().filter((l) => l.id != lobby_id));
    }
}
