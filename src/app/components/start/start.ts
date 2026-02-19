import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebSocketService } from '../../services/websocket';
import { Router } from '@angular/router';
import { GlobalStore } from '../../services/globals';

@Component({
    selector: 'app-start',
    imports: [ReactiveFormsModule],
    templateUrl: './start.html',
    styleUrl: './start.css',
})
export class Start {
    username = new FormControl('', [Validators.required, Validators.minLength(4)]);

    constructor(
        private wsService: WebSocketService,
        private globalStore: GlobalStore,
        private router: Router,
    ) {}

    ngOnInit() {
        this.wsService.getMessages().subscribe({
            next: (msg) => {},
        });
    }

    enter() {
        this.globalStore.setUsername(this.username.value || '');
        this.wsService.sendMessage('enterWaitingRoom', {
            username: this.username.value,
        });
        this.router.navigateByUrl('/waiting-room');
    }
}
