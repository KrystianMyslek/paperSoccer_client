import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { WebSocketService } from '../../services/websocket';
import { GlobalStore } from '../../services/globals';

@Component({
    selector: 'app-waiting-room',
    imports: [],
    templateUrl: './waitingRoom.html',
    styleUrl: './waitingRoom.css',
})
export class WaitingRoom {
    constructor(
        private wsService: WebSocketService,
        public globalStore: GlobalStore,
        private router: Router,
    ) {}

    ngOnInit() {
        if (this.globalStore.getUsername() == '') {
            this.router.navigateByUrl('/');
        }

        this.wsService.getMessages().subscribe({
            next: (msg) => {
                console.log(msg);
            },
        });
    }
}
