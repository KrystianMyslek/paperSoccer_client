import { Injectable } from '@angular/core';
import { player } from '../types';

@Injectable({
    providedIn: 'root',
})
export class GlobalStore {
    public username = '';
    public player = player.empty;

    getUsername() {
        return this.username;
    }

    setUsername(name: string) {
        this.username = name;
    }

    setPlayer(player: player) {
        this.player = player;
    }

    getPlayer() {
        return this.player;
    }
}
