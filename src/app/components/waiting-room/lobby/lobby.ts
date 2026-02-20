import { Component, input } from '@angular/core';
import { lobby } from '../../../types';
import { Router } from '@angular/router';
import { GlobalStore } from '../../../services/globals';
import { WebSocketService } from '../../../services/websocket';

@Component({
    selector: 'app-lobby',
    imports: [],
    templateUrl: './lobby.html',
    styleUrl: './lobby.css',
})
export class Lobby {
    constructor(
        private wsService: WebSocketService,
        public globalStore: GlobalStore,
        private router: Router,
    ) {}

    lobby = input.required<lobby>();

    joinLobby() {
        this.wsService.sendMessage('setup', 'enterLobby', {
            lobby_id: this.lobby().id,
        });
    }
}
