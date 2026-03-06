import colors from '../../../colors';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { fieldPlayer, player } from '../../../types';
import { GlobalStore } from '../../../services/globals';

@Component({
    selector: 'app-field-v-line',
    imports: [CommonModule],
    templateUrl: './field-v-line.html',
    styleUrl: './field-v-line.css',
})
export class FieldVLine {
    constructor(private globalStore: GlobalStore) {}

    @Output() moveEmiter = new EventEmitter<{
        type: string;
        new_possition: { x: number; y: number };
    }>();

    colors = colors;

    myMove = input(false as boolean);
    v_lines = input([[]] as fieldPlayer[][]);
    available_v_lines = input([[]] as boolean[][]);
    border = input(false as boolean);
    ri = input(0 as number);
    ci = input(0 as number);

    id = signal<string>(uuidv4());

    ngOnInit() {
        this.id.set(this.getId());
    }

    moveEmit() {
        if (!this.isOcupied() && this.isPlayable()) {
            this.moveEmiter.emit({ type: 'v_line', new_possition: { x: this.ri(), y: this.ci() } });
        }
    }

    getId() {
        return !this.border() ? 'v_line_' + this.ri() + '_' + this.ci() : this.id();
    }

    getClass() {
        if (this.isBorder()) {
            return `w-32 ${this.colors.border}`;
        } else if (this.isPlayer(fieldPlayer.A)) {
            return `w-26 rounded-full ${this.colors.playerA}`;
        } else if (this.isPlayer(fieldPlayer.B)) {
            return `w-26 rounded-full ${this.colors.playerB}`;
        } else if (this.isPlayable()) {
            return `w-24 rounded-full cursor-pointer ${this.colors.playable} hover:${this.colors.playablehover}`;
        } else {
            return ``;
        }
    }

    isBorder() {
        return this.border();
    }

    isPlayer(player: fieldPlayer) {
        return this.border() || this.v_lines()[this.ri()][this.ci()] === player;
    }

    isOcupied() {
        return this.isPlayer(fieldPlayer.A) || this.isPlayer(fieldPlayer.B);
    }

    isPlayable() {
        if (this.isBorder() || !this.myMove()) {
            return false;
        }

        return (
            this.available_v_lines()[this.ri()] && this.available_v_lines()[this.ri()][this.ci()]
        );
    }
}
