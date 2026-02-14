import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GlobalStore {
    public username = '';

    getUsername() {
        return this.username;
    }

    setUsername(name: string) {
        this.username = name;
    }
}
