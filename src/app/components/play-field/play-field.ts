import { Component, input, signal } from '@angular/core';
import { FieldPart } from './../field-part/field-part';
import { FieldHLine } from '../field-h-line/field-h-line';
import { FieldVLine } from '../field-v-line/field-v-line';
import { FieldDot } from '../field-dot/field-dot';
import { player, pos } from '../../types';

@Component({
    selector: 'app-play-field',
    imports: [FieldPart, FieldHLine, FieldVLine, FieldDot],
    templateUrl: './play-field.html',
    styleUrl: './play-field.css',
})
export class PlayField {
    fieldSize = input<pos>({ x: 4, y: 8 });

    rows: number[] = [];
    cols: number[] = [];

    active = signal<pos>({ x: 0, y: 0 });
    mid: pos = { x: 0, y: 0 };

    v_lines = signal<player[][]>([]);
    h_lines = signal<player[][]>([]);
    l_cross = signal<player[][]>([]);
    r_cross = signal<player[][]>([]);
    goals: { [key: string]: number[][] } = {
        A: [],
        B: [],
    };

    ngOnInit() {
        this.rows = Array(this.fieldSize().x);
        this.cols = Array(this.fieldSize().y);

        this.active.set({
            x: Math.floor(this.fieldSize().x / 2),
            y: Math.floor(this.fieldSize().y / 2),
        });

        this.mid = {
            x: Math.floor(this.fieldSize().x / 2),
            y: Math.floor(this.fieldSize().y / 2),
        };

        this.v_lines.set(
            Array(this.fieldSize().x)
                .fill(player.empty)
                .map(() => Array(this.fieldSize().y).fill(player.empty)),
        );

        this.h_lines.set(
            Array(this.fieldSize().x)
                .fill(player.empty)
                .map(() => Array(this.fieldSize().y).fill(player.empty)),
        );

        this.l_cross.set(
            Array(this.fieldSize().x)
                .fill(player.empty)
                .map(() => Array(this.fieldSize().y).fill(player.empty)),
        );

        this.r_cross.set(
            Array(this.fieldSize().x)
                .fill(player.empty)
                .map(() => Array(this.fieldSize().y).fill(player.empty)),
        );

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
    }
}
