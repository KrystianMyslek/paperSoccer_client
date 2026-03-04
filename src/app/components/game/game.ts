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
        if (
            this.globalStore.getPlayer().id == undefined ||
            this.globalStore.getGame().id == undefined
        ) {
            this.router.navigateByUrl('/');
        }

        this.game.set(this.globalStore.getGame());
        this.fieldSize = this.game().size;
    }
}
