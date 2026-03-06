import { fieldPlayer } from './../../types';
import { Component, signal } from '@angular/core';
import { PlayField } from '../play-field/play-field';
import { Router } from '@angular/router';
import { GlobalStore } from '../../services/globals';
import { WebSocketService } from '../../services/websocket';
import { game } from '../../types';

@Component({
    selector: 'app-game',
    imports: [PlayField],
    templateUrl: './game.html',
    styleUrl: './game.css',
})
export class Game {
    constructor(
        private wsService: WebSocketService,
        public globalStore: GlobalStore,
        private router: Router,
    ) {}

    game = signal({} as game);
    fieldSize = { x: 0, y: 0 };

    ngOnInit() {
        const player = this.globalStore.getPlayer();

        if (player.id == undefined || this.globalStore.getGame().id == undefined) {
            this.router.navigateByUrl('/');
        }

        this.game.set(this.globalStore.getGame());
        this.fieldSize = this.game().size;

        if (player.id == this.game().player_A_id) {
            this.globalStore.setPlayer({ ...player, type: fieldPlayer.A });
        } else if (player.id == this.game().player_B_id) {
            this.globalStore.setPlayer({ ...player, type: fieldPlayer.B });
        }

        this.wsService.getMessages().subscribe({
            next: (msg) => {
                switch (msg.type) {
                    case 'game_destroyed':
                        this.globalStore.deleteGame();
                        this.wsService.sendMessage('setup', 'returnToWaitingRoom');
                        this.router.navigateByUrl('/waiting-room');
                        break;
                }
            },
        });
    }

    ngOnDestroy() {
        this.wsService.sendPhantomMessage('game', 'destroyGame');
    }
}
