import { Component, input, signal } from '@angular/core';
import { FieldPart } from './field-part/field-part';
import { FieldHLine } from './field-h-line/field-h-line';
import { FieldVLine } from './field-v-line/field-v-line';
import { FieldDot } from './field-dot/field-dot';
import { fieldPlayer, size } from '../../types';
import { GlobalStore } from '../../services/globals';
import { WebSocketService } from '../../services/websocket';

@Component({
    selector: 'app-play-field',
    imports: [FieldPart, FieldHLine, FieldVLine, FieldDot],
    templateUrl: './play-field.html',
    styleUrl: './play-field.css',
})
export class PlayField {
    constructor(
        private wsService: WebSocketService,
        public globalStore: GlobalStore,
    ) {}

    fieldSize = input<size>({ x: 4, y: 8 });

    myMove = signal(false);

    rows: number[] = Array(this.fieldSize().x);
    cols: number[] = Array(this.fieldSize().y);

    active = signal<size>({
        x: Math.floor(this.fieldSize().x / 2),
        y: Math.floor(this.fieldSize().y / 2),
    });

    mid: size = {
        x: Math.floor(this.fieldSize().x / 2),
        y: Math.floor(this.fieldSize().y / 2),
    };

    doneMoves = signal({
        v_lines: <fieldPlayer[][]>(
            this.newMoveArray(this.fieldSize().x, this.fieldSize().y, fieldPlayer.empty)
        ),
        h_lines: <fieldPlayer[][]>(
            this.newMoveArray(this.fieldSize().x, this.fieldSize().y, fieldPlayer.empty)
        ),
        l_cross: <fieldPlayer[][]>(
            this.newMoveArray(this.fieldSize().x, this.fieldSize().y, fieldPlayer.empty)
        ),
        r_cross: <fieldPlayer[][]>(
            this.newMoveArray(this.fieldSize().x, this.fieldSize().y, fieldPlayer.empty)
        ),
    });

    availableMoves = signal({
        v_lines: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
        h_lines: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
        l_cross: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
        r_cross: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
    });

    newMoveArray(x: number, y: number, fill: any): any[][] {
        return Array(x)
            .fill(fill)
            .map(() => Array(y).fill(fill));
    }

    goals: { [key: string]: number[][] } = {
        A: [
            [this.mid.x - 1, 0],
            [this.mid.x, 0],
            [this.mid.x + 1, 0],
        ],
        B: [
            [this.mid.x - 1, this.fieldSize().y],
            [this.mid.x, this.fieldSize().y],
            [this.mid.x + 1, this.fieldSize().y],
        ],
    };

    ngOnInit() {
        this.wsService.sendMessage('game', 'getAvailableMoves', {
            game_id: this.globalStore.getGame().id,
        });

        this.wsService.getMessages().subscribe({
            next: (msg) => {
                switch (msg.type) {
                    case 'done_moves':
                        this.doneMoves.set(msg.payload.doneMoves);
                        break;
                    case 'available_moves':
                        this.myMove.set(msg.payload.myMove);
                        this.availableMoves.set(msg.payload.availableMoves);
                        break;
                    case 'change_active_player':
                        this.myMove.set(msg.payload.isMyMove);
                        break;
                }
            },
        });
    }
}
