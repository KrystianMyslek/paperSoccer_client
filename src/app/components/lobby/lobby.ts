import { lobby, player } from './../../types';
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

    get ownerName() {
        const owner = this.lobby().owner as player;
        return owner.name;
    }

    get opponentName() {
        const opponent = this.lobby().opponent as player;

        if (!opponent) {
            return 'Waiting for opponent...';
        }

        return opponent.name;
    }

    get isOwner() {
        return this.globalStore.getPlayer().id === this.lobby().owner.id;
    }

    get canStartGame() {
        return this.isOwner && this.lobby().opponent;
    }

    cancelGame() {
        this.wsService.sendMessage('setup', 'destroyLobby', {
            lobbyId: this.lobby().id,
        });

        this.globalStore.deleteLobby();
        this.wsService.sendMessage('setup', 'returnToWaitingRoom');
        this.router.navigateByUrl('/waiting-room');
    }

    startGame() {
        this.wsService.sendMessage('game', 'newGame', {
            lobbyId: this.lobby().id,
        });
    }

    ngOnInit() {
        if (
            this.globalStore.getPlayer().id == undefined ||
            this.globalStore.getLobby().id == undefined
        ) {
            this.router.navigateByUrl('/');
        }

        this.lobby.set(this.globalStore.getLobby());

        this.wsService.getMessages().subscribe({
            next: (msg) => {
                switch (msg.type) {
                    case 'lobby_entered':
                        this.globalStore.setLobby(msg.payload.lobby);
                        this.lobby.set(msg.payload.lobby);
                        break;
                    case 'lobby_destroyed':
                        this.globalStore.deleteLobby();
                        this.wsService.sendMessage('setup', 'returnToWaitingRoom');
                        this.router.navigateByUrl('/waiting-room');
                        break;
                    case 'game_created':
                        this.globalStore.deleteLobby();
                        this.globalStore.setGame(msg.payload.game);
                        this.router.navigateByUrl('/game');
                        break;
                }
            },
        });
    }

    ngOnDestroy() {
        this.wsService.sendPhantomMessage('setup', 'destroyLobby');
    }
}
