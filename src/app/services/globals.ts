import { Injectable } from '@angular/core';
import { lobby, player } from '../types';

@Injectable({
    providedIn: 'root',
})
export class GlobalStore {
    private player: player = {} as player;
    private lobby: lobby = {} as lobby;

    setPlayer(player: player) {
        this.player = player;
    }

    getPlayer() {
        return this.player;
    }

    setLobby(lobby: lobby) {
        this.lobby = lobby;
    }

    getLobby() {
        return this.lobby;
    }
}
