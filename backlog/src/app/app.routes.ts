import { Routes } from '@angular/router';
import { ProjectOverview } from './features/project-overview/project-overview';
import { Board } from './features/board/board';
import { Login } from './features/login/login';

export const routes: Routes = [
    {
        path: '',
        component: ProjectOverview
    },
    {
        path: 'board/:projectId',
        component: Board
    },
    {
        path: 'login',
        component: Login
    }
];
