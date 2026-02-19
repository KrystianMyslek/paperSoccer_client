import { lobby } from './../../../types';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalStore } from '../../../services/globals';
import { WebSocketService } from '../../../services/websocket';

@Component({
    selector: 'app-new-lobby',
    imports: [ReactiveFormsModule],
    templateUrl: './new-lobby.html',
    styleUrl: './new-lobby.css',
})
export class NewLobby {
    constructor(
        private wsService: WebSocketService,
        public globalStore: GlobalStore,
        private router: Router,
    ) {}

    lobbyName = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)],
    });
    lobbySizeX = new FormControl(4, { nonNullable: true });
    lobbySizeY = new FormControl(6, { nonNullable: true });

    createLobby() {
        if (this.lobbyName.valid) {
            const lobby: lobby = {
                name: this.lobbyName.value,
                owner: this.globalStore.getUsername(),
                size: { x: this.lobbySizeX.value, y: this.lobbySizeY.value },
            };

            this.wsService.sendMessage('newLobby', lobby);
            this.globalStore.setLobby(lobby);
        } else {
            this.lobbyName.markAsTouched();
        }
    }
}
