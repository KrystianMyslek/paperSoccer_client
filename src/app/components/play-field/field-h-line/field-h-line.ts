import colors from '../../../colors';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { fieldPlayer, player } from '../../../types';
import { GlobalStore } from '../../../services/globals';

@Component({
    selector: 'app-field-h-line',
    imports: [CommonModule],
    templateUrl: './field-h-line.html',
    styleUrl: './field-h-line.css',
})
export class FieldHLine {
    constructor(private globalStore: GlobalStore) {}

    @Output() moveEmiter = new EventEmitter<{
        type: string;
        new_possition: { x: number; y: number };
    }>();

    colors = colors;

    myMove = input(false as boolean);
    h_lines = input([[]] as fieldPlayer[][]);
    available_h_lines = input([[]] as boolean[][]);
    border = input(false as boolean);
    ri = input(0 as number);
    ci = input(0 as number);

    id = signal<string>(uuidv4());

    ngOnInit() {
        this.id.set(this.getId());
    }

    moveEmit() {
        if (!this.isOcupied() && this.isPlayable()) {
            this.moveEmiter.emit({ type: 'h_line', new_possition: { x: this.ri(), y: this.ci() } });
        }
    }

    getId() {
        return !this.border() ? 'h_line_' + this.ri() + '_' + this.ci() : this.id();
    }

    getClass() {
        if (this.isBorder()) {
            return `h-32 ${this.colors.border}`;
        } else if (this.isPlayer(fieldPlayer.A)) {
            return `h-26 rounded-full ${this.colors.playerA}`;
        } else if (this.isPlayer(fieldPlayer.B)) {
            return `h-26 rounded-full ${this.colors.playerB}`;
        } else if (this.isPlayable()) {
            return `h-24 rounded-full cursor-pointer ${this.colors.playable} hover:${this.colors.playablehover}`;
        } else {
            return ``;
        }
    }

    isBorder() {
        return this.border();
    }

    isPlayer(player: fieldPlayer) {
        return this.border() || this.h_lines()[this.ri()][this.ci()] === player;
    }

    isOcupied() {
        return this.isPlayer(fieldPlayer.A) || this.isPlayer(fieldPlayer.B);
    }

    isPlayable() {
        if (this.isBorder() || !this.myMove()) {
            return false;
        }

        return (
            this.available_h_lines()[this.ri()] && this.available_h_lines()[this.ri()][this.ci()]
        );
    }
}
