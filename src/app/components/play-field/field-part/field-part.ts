import colors from '../../../colors';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output, signal } from '@angular/core';
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

    @Output() moveEmiter = new EventEmitter<{
        type: string;
        new_possition: { x: number; y: number };
    }>();

    colors = colors;

    myMove = input(false as boolean);
    l_cross = input([[]] as fieldPlayer[][]);
    available_l_cross = input([[]] as boolean[][]);
    r_cross = input([[]] as fieldPlayer[][]);
    available_r_cross = input([[]] as boolean[][]);
    ri = input(0 as number);
    ci = input(0 as number);

    lId = signal<string>(uuidv4());
    rId = signal<string>(uuidv4());

    ngOnInit() {
        this.lId.set(this.getId('L'));
        this.rId.set(this.getId('R'));
    }

    moveEmit(type: string) {
        switch (type) {
            case 'L':
                if (!this.isOcupied('L') && this.isPlayable('L')) {
                    this.moveEmiter.emit({
                        type: 'l_cross',
                        new_possition: { x: this.ri(), y: this.ci() },
                    });
                }
                break;
            case 'R':
                if (!this.isOcupied('R') && this.isPlayable('R')) {
                    this.moveEmiter.emit({
                        type: 'r_cross',
                        new_possition: { x: this.ri(), y: this.ci() },
                    });
                }
                break;
            default:
                break;
        }
    }

    getId(type: string) {
        return this.ri() && this.ci()
            ? type.toLowerCase() + '_cross_' + this.ri() + '_' + this.ci()
            : type === 'L'
              ? this.lId()
              : this.rId();
    }

    getClass(type: string) {
        if (this.isPlayer(type, fieldPlayer.A)) {
            return `h-[110%] ${this.colors.playerA}`;
        } else if (this.isPlayer(type, fieldPlayer.B)) {
            return `h-[110%] ${this.colors.playerB}`;
        } else if (this.isPlayable(type)) {
            return `rounded-full cursor-pointer ${this.colors.playable} hover:${this.colors.playablehover}`;
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

    isOcupied(type: string) {
        return this.isPlayer(type, fieldPlayer.A) || this.isPlayer(type, fieldPlayer.B);
    }

    isPlayable(type: string) {
        if (!this.myMove()) {
            return false;
        }

        switch (type) {
            case 'L':
                return (
                    this.available_l_cross()[this.ri()] &&
                    this.available_l_cross()[this.ri()][this.ci()]
                );
            case 'R':
                return (
                    this.available_r_cross()[this.ri()] &&
                    this.available_r_cross()[this.ri()][this.ci()]
                );
            default:
                return false;
        }
    }
}
