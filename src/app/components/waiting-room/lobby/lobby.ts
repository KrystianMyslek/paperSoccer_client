import { Component, input } from '@angular/core';
import { lobby } from '../../../types';

@Component({
    selector: 'app-lobby',
    imports: [],
    templateUrl: './lobby.html',
    styleUrl: './lobby.css',
})
export class Lobby {
    lobby = input.required<lobby>();

    joinLobby() {
        console.log('Joining lobby: ' + this.lobby().name);
    }
}
