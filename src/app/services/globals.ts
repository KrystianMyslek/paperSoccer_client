import { Injectable } from '@angular/core';
import { lobby, player, game } from '../types';

@Injectable({
    providedIn: 'root',
})
export class GlobalStore {
    private player: player = {} as player;
    private lobby: lobby = {} as lobby;
    private game: game = {} as game;

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

    deleteLobby() {
        this.lobby = {} as lobby;
    }

    setGame(game: game) {
        this.game = game;
    }

    getGame() {
        return this.game;
    }

    deleteGame() {
        this.game = {} as game;
    }
}
