import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebSocketService } from '../../services/websocket';
import { Router } from '@angular/router';
import { GlobalStore } from '../../services/globals';
import { player } from '../../types';

@Component({
    selector: 'app-start',
    imports: [ReactiveFormsModule],
    templateUrl: './start.html',
    styleUrl: './start.css',
})
export class Start {
    username = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
    });

    constructor(
        private wsService: WebSocketService,
        private globalStore: GlobalStore,
        private router: Router,
    ) {}

    ngOnInit() {
        this.wsService.getMessages().subscribe({
            next: (msg) => {
                switch (msg.type) {
                    case 'waiting_room_entered':
                        const player = {
                            id: msg.payload.player_id,
                            name: this.username.value,
                        } as player;

                        this.globalStore.setPlayer(player);
                        this.router.navigateByUrl('/waiting-room');
                        break;
                }
            },
        });
    }

    enter() {
        if (this.username.valid) {
            this.wsService.sendMessage('setup', 'enterWaitingRoom', {
                username: this.username.value,
            });
        } else {
            this.username.markAsTouched();
        }
    }
}
