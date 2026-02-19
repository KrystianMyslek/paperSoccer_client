import colors from '../../colors';
import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { player } from '../../types';
import { GlobalStore } from '../../services/globals';

@Component({
    selector: 'app-field-part',
    imports: [CommonModule],
    templateUrl: './field-part.html',
    styleUrl: './field-part.css',
})
export class FieldPart {
    constructor(private globalStore: GlobalStore) {}

    colors = colors;
    thisPlayer = player.empty;

    l_cross = input([[] as player[]] as player[][]);
    r_cross = input([[] as player[]] as player[][]);
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
            this.l_cross()[this.ri()][this.ci()] = this.thisPlayer;
        } else if (type === 'R') {
            this.r_cross()[this.ri()][this.ci()] = this.thisPlayer;
        }
    }

    getLId() {
        return this.ri() && this.ci() ? 'l_cross_' + this.ri() + '_' + this.ci() : this.lId();
    }

    getRId() {
        return this.ri() && this.ci() ? 'r_cross_' + this.ri() + '_' + this.ci() : this.rId();
    }

    getLClass() {
        if (this.isPlayer('L', player.A)) {
            return `h-[110%] ${this.colors.playerA}`;
        } else if (this.isPlayer('L', player.B)) {
            return `h-[110%] ${this.colors.playerB}`;
        } else if (this.isLPlayable()) {
            return ` cursor-pointer hover:${this.colors.playable}`;
        } else {
            return '';
        }
    }

    getRClass() {
        if (this.isPlayer('R', player.A)) {
            return `h-[110%] ${this.colors.playerA}`;
        } else if (this.isPlayer('R', player.B)) {
            return `h-[110%] ${this.colors.playerB}`;
        } else if (this.isRPlayable()) {
            return `cursor-pointer hover:${this.colors.playable}`;
        } else {
            return '';
        }
    }

    isPlayer(type: string, player: player) {
        switch (type) {
            case 'L':
                return this.l_cross()[this.ri()][this.ci()] === player;
            case 'R':
                return this.r_cross()[this.ri()][this.ci()] === player;
            default:
                return false;
        }
    }

    // isLActive() {
    //     return this.l_cross()[this.ri()][this.ci()];
    // }

    // isRActive() {
    //     return this.r_cross()[this.ri()][this.ci()];
    // }

    isLPlayable() {
        return true;
    }

    isRPlayable() {
        return true;
    }
}
