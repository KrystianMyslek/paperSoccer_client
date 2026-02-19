import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalStore } from '../../services/globals';
import { WebSocketService } from '../../services/websocket';

@Component({
    selector: 'app-lobby',
    imports: [],
    templateUrl: './lobby.html',
    styleUrl: './lobby.css',
})
export class Lobby {
    constructor(
        private wsService: WebSocketService,
        public globalStore: GlobalStore,
        private router: Router,
    ) {}

    ngOnInit() {
        if (this.globalStore.getUsername() == '' || this.globalStore.getLobby().id == undefined) {
            this.router.navigateByUrl('/');
        }
    }
}
