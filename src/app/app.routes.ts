import { Routes } from '@angular/router';
import { ProjectOverview } from './features/project-overview/project-overview';
import { Board } from './features/board/board';
import { Login } from './features/login/login';
import { loginGuard } from './guards/login-guard';

export const routes: Routes = [
    {
        path: '',
        component: ProjectOverview,
        canActivate: [loginGuard]
    },
    {
        path: 'board/:projectId',
        component: Board,
        canActivate: [loginGuard]
    },
    {
        path: 'login',
        component: Login
    }
];
