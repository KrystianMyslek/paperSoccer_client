import colors from '../../../colors';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { fieldPlayer, player } from '../../../types';
import { GlobalStore } from '../../../services/globals';

@Component({
    selector: 'app-field-part',
    imports: [CommonModule],
    templateUrl: './field-part.html',
    styleUrl: './field-part.css',
})
export class FieldPart {
    constructor(private globalStore: GlobalStore) {}

    colors = colors;
    thisPlayer: player = {} as player;

    l_cross = input([[] as fieldPlayer[]] as fieldPlayer[][]);
    r_cross = input([[] as fieldPlayer[]] as fieldPlayer[][]);
    ri = input(0 as number);
    ci = input(0 as number);

    lId = signal<string>(uuidv4());
    rId = signal<string>(uuidv4());

    ngOnInit() {
        this.lId.set(this.getLId());
        this.rId.set(this.getRId());

        this.thisPlayer = this.globalStore.getPlayer();
    }

    move(type: string) {
        if (type === 'L') {
            this.l_cross()[this.ri()][this.ci()] = this.thisPlayer.type;
        } else if (type === 'R') {
            this.r_cross()[this.ri()][this.ci()] = this.thisPlayer.type;
        }
    }

    getLId() {
        return this.ri() && this.ci() ? 'l_cross_' + this.ri() + '_' + this.ci() : this.lId();
    }

    getRId() {
        return this.ri() && this.ci() ? 'r_cross_' + this.ri() + '_' + this.ci() : this.rId();
    }

    getLClass() {
        if (this.isPlayer('L', fieldPlayer.A)) {
            return `h-[110%] ${this.colors.playerA}`;
        } else if (this.isPlayer('L', fieldPlayer.B)) {
            return `h-[110%] ${this.colors.playerB}`;
        } else if (this.isLPlayable()) {
            return ` cursor-pointer hover:${this.colors.playable}`;
        } else {
            return '';
        }
    }

    getRClass() {
        if (this.isPlayer('R', fieldPlayer.A)) {
            return `h-[110%] ${this.colors.playerA}`;
        } else if (this.isPlayer('R', fieldPlayer.B)) {
            return `h-[110%] ${this.colors.playerB}`;
        } else if (this.isRPlayable()) {
            return `cursor-pointer hover:${this.colors.playable}`;
        } else {
            return '';
        }
    }

    isPlayer(type: string, player: fieldPlayer) {
        switch (type) {
            case 'L':
                return this.l_cross()[this.ri()][this.ci()] === player;
            case 'R':
                return this.r_cross()[this.ri()][this.ci()] === player;
            default:
                return false;
        }
    }

    isLPlayable() {
        return true;
    }

    isRPlayable() {
        return true;
    }
}
