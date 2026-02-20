import { lobby } from './../../types';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStore } from '../../services/globals';
import { WebSocketService } from '../../services/websocket';

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

    lobby = signal({} as lobby);

    ngOnInit() {
        this.lobby.set(this.globalStore.getLobby());

        if (
            this.globalStore.getPlayer().id == undefined ||
            this.globalStore.getLobby().id == undefined
        ) {
            this.router.navigateByUrl('/');
        }

        this.wsService.getMessages().subscribe({
            next: (msg) => {
                switch (msg.type) {
                    case 'lobby_entered':
                        this.globalStore.setLobby(msg.payload.lobby);
                        this.lobby.set(msg.payload.lobby);
                        break;
                }
            },
        });
    }

    ngOnDestroy() {
        this.wsService.sendPhantomMessage('setup', 'destroyLobby');
    }
}
