import { Component, input, signal } from '@angular/core';
import { FieldPart } from './field-part/field-part';
import { FieldHLine } from './field-h-line/field-h-line';
import { FieldVLine } from './field-v-line/field-v-line';
import { FieldDot } from './field-dot/field-dot';
import { fieldPlayer, size, goal } from '../../types';
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

    rows: number[] = [];
    cols: number[] = [];
    mid: size = {} as size;
    goals: goal = {} as goal;

    myMove = signal(false);
    active = signal({} as size);

    doneMoves = signal({ v_lines: [], h_lines: [], l_cross: [], r_cross: [] } as {
        v_lines: fieldPlayer[][];
        h_lines: fieldPlayer[][];
        l_cross: fieldPlayer[][];
        r_cross: fieldPlayer[][];
    });

    availableMoves = signal({ v_lines: [], h_lines: [], l_cross: [], r_cross: [] } as {
        v_lines: boolean[][];
        h_lines: boolean[][];
        l_cross: boolean[][];
        r_cross: boolean[][];
    });

    newMoveArray(x: number, y: number, fill: any): any[][] {
        return Array(x)
            .fill(fill)
            .map(() => Array(y).fill(fill));
    }

    move(data: { type: string; new_possition: { x: number; y: number } }) {
        console.log('move');
        console.log(data);
        this.wsService.sendMessage('game', 'makeMove', {
            game_id: this.globalStore.getGame().id,
            type: data.type,
            new_possition: data.new_possition,
        });
    }

    ngOnInit() {
        this.wsService.sendMessage('game', 'getAvailableMoves', {
            game_id: this.globalStore.getGame().id,
        });

        this.rows = Array(this.fieldSize().x);
        this.cols = Array(this.fieldSize().y);

        this.mid = {
            x: Math.floor(this.fieldSize().x / 2),
            y: Math.floor(this.fieldSize().y / 2),
        };

        this.goals = {
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

        this.active.set({
            x: Math.floor(this.fieldSize().x / 2),
            y: Math.floor(this.fieldSize().y / 2),
        });

        this.doneMoves.set({
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

        this.availableMoves.set({
            v_lines: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
            h_lines: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
            l_cross: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
            r_cross: <boolean[][]>this.newMoveArray(this.fieldSize().x, this.fieldSize().y, false),
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
