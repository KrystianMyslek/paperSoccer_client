import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./components/start/start').then((m) => m.Start),
    },
    {
        path: 'waiting-room',
        loadComponent: () =>
            import('./components/waiting-room/waiting-room').then((m) => m.WaitingRoom),
    },
    {
        path: 'lobby/:id',
        loadComponent: () => import('./components/lobby/lobby').then((m) => m.Lobby),
    },
];
