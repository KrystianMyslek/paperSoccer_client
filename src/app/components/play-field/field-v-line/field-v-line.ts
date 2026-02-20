import colors from '../../../colors';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
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
    colors = colors;

    thisPlayer: player = {} as player;
    v_lines = input([[] as fieldPlayer[]] as fieldPlayer[][]);
    border = input(false as boolean);
    ri = input(0 as number);
    ci = input(0 as number);

    id = signal<string>(uuidv4());

    ngOnInit() {
        this.id.set(this.getId());
        this.thisPlayer = this.globalStore.getPlayer();
    }

    move() {
        this.v_lines()[this.ri()][this.ci()] = this.thisPlayer.type;
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
            return `w-24 rounded-full cursor-pointer hover:${this.colors.playable}`;
        } else {
            return `w-24 rounded-full ${this.colors.border}`;
        }
    }

    isBorder() {
        return this.border();
    }

    isPlayer(player: fieldPlayer) {
        return this.border() || this.v_lines()[this.ri()][this.ci()] === player;
    }

    isPlayable() {
        return this.isBorder() ? false : true;
    }
}
