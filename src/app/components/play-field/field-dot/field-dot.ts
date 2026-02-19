import colors from '../../../colors';
import { size } from '../../../types';
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-field-dot',
    imports: [CommonModule],
    templateUrl: './field-dot.html',
    styleUrl: './field-dot.css',
})
export class FieldDot {
    colors = colors;
    active = input({ x: 1, y: 1 } as size);
    playable = input(true as boolean);
    goals = input({
        A: [],
        B: [],
    } as { [key: string]: number[][] });
    ri = input(0 as number);
    ci = input(0 as number);

    getClass() {
        if (this.isActive()) {
            return colors.active;
        } else if (this.isGoal()) {
            return colors.goal;
        } else if (this.isPlayable()) {
            return colors.playable;
        } else {
            return colors.border;
        }
    }

    isActive() {
        return this.active().x == this.ri() && this.active().y == this.ci();
    }

    isPlayable() {
        return this.playable();
    }

    isGoal() {
        return (
            this.goals()['A'].some((goal: number[]) => {
                return goal[0] == this.ri() && goal[1] == this.ci();
            }) ||
            this.goals()['B'].some((goal: number[]) => {
                return goal[0] == this.ri() && goal[1] == this.ci();
            })
        );
    }
}
