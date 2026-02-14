import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WebSocketService } from './services/websocket';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`,
    styles: [``],
})
export class App {
    protected readonly title = signal('paperSoccer');

    constructor(private wsService: WebSocketService) {}

    ngOnInit() {
        this.wsService.getMessages().subscribe({
            next: (msg) => {},
        });
    }
}
