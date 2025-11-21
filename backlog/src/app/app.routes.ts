import { Routes } from '@angular/router';
import { ProjectOverview } from './features/project-overview/project-overview';
import { Board } from './features/board/board';

export const routes: Routes = [
    {
        path: '',
        component: ProjectOverview
    },
    {
        path: 'board/:projectId',
        component: Board
    }
];
