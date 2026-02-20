import colors from '../../../colors';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
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

    colors = colors;
    thisPlayer: player = {} as player;
    h_lines = input([[] as fieldPlayer[]] as fieldPlayer[][]);
    border = input(false as boolean);
    ri = input(0 as number);
    ci = input(0 as number);

    id = signal<string>(uuidv4());

    ngOnInit() {
        this.id.set(this.getId());
        this.thisPlayer = this.globalStore.getPlayer();
    }

    move() {
        this.h_lines()[this.ri()][this.ci()] = this.thisPlayer.type;
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
            return `h-24 rounded-full cursor-pointer hover:${this.colors.playable}`;
        } else {
            return `h-24 rounded-full ${this.colors.border}`;
        }
    }

    isBorder() {
        return this.border();
    }

    isPlayer(player: fieldPlayer) {
        return this.border() || this.h_lines()[this.ri()][this.ci()] === player;
    }

    isPlayable() {
        return this.isBorder() ? false : true;
    }
}
