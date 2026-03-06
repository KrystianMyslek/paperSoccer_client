import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
    ) {}

    lobbyName = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(4)],
    });
    lobbySizeX = new FormControl(4, { nonNullable: true });
    lobbySizeY = new FormControl(6, { nonNullable: true });

    createLobby() {
        if (this.lobbyName.valid) {
            const lobby = {
                name: this.lobbyName.value,
                size: { x: this.lobbySizeX.value, y: this.lobbySizeY.value },
            };

            this.wsService.sendMessage('setup', 'newLobby', lobby);
        } else {
            this.lobbyName.markAsTouched();
        }
    }
}
