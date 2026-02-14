import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./compoonents/start/start').then((m) => m.Start),
    },
    {
        path: 'waiting-room',
        loadComponent: () =>
            import('./compoonents/waitingRoom/waitingRoom').then((m) => m.WaitingRoom),
    },
];
