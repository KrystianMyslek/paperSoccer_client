import { Injectable } from '@angular/core';
import { fieldPlayer, lobby } from '../types';

@Injectable({
    providedIn: 'root',
})
export class GlobalStore {
    private id: string = '';
    private username: string = '';
    private player: fieldPlayer = fieldPlayer.empty;
    private lobby: lobby = <lobby>{};

    getId() {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }

    getUsername() {
        return this.username;
    }

    setUsername(name: string) {
        this.username = name;
    }

    setPlayer(player: fieldPlayer) {
        this.player = player;
    }

    getPlayer() {
        return this.player;
    }

    setLobby(lobby: lobby) {
        this.lobby = lobby;
    }

    setLobbyId(lobbyId: string) {
        this.lobby.id = lobbyId;
    }

    getLobby() {
        return this.lobby;
    }
}
