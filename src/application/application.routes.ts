import { Routes } from '@angular/router';


import { authenticatedGuard } from './services/guards/authenticated.guard';


/**
 * Defines the application's routes.
 */
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'login',
        data: { view: 'login' },
        loadComponent: () => import('./layouts/access/access.component').then(item => item.AccessComponent)
    },
    {
        path: 'register',
        data: { view: 'register' },
        loadComponent: () => import('./layouts/access/access.component').then(item => item.AccessComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./layouts/forgot-password/forgot-password.component').then(item => item.ForgotPasswordComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./layouts/reset-password/reset-password.component').then(item => item.ResetPasswordComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./layouts/dashboard/dashboard.component').then(item => item.DashboardComponent),
        canActivate: [authenticatedGuard]
    },
    {
        path: 'games',
        canActivate: [authenticatedGuard],
        children: [
            {
                path:'connect4',
                children: [
                    {
                        path:'recap',
                        loadComponent: () => import('./layouts/game-recaps').then(item => item.Connect4RecapComponent)
                    },
                    {
                        path:'play',
                        loadComponent: () => import('./layouts/game-play').then(item => item.Connect4PlayComponent)
                    }
                ]
            },
            {
                path:'conquer',
                children: [
                    {
                        path:'recap',
                        loadComponent: () => import('./layouts/game-recaps').then(item => item.ConquerRecapComponent)
                    },
                    {
                        path:'play',
                        loadComponent: () => import('./layouts/game-play').then(item => item.ConquerPlayComponent)
                    }
                ]
            },
            {
                path:'domino',
                children: [
                    {
                        path:'recap',
                        loadComponent: () => import('./layouts/game-recaps').then(item => item.DominoRecapComponent)
                    },
                    {
                        path:'play',
                        loadComponent: () => import('./layouts/game-play').then(item => item.DominoPlayComponent)
                    }
                ]
            }
        ]
    },
    // {
    //     path: 'family',
    //     loadComponent: () => import('./layouts/family/family.component').then(item => item.FamilyComponent),
    //     canActivate: [authenticatedGuard]
    // },
    {
        path: 'account',
        loadComponent: () => import('./layouts/account/account.component').then(item => item.AccountComponent),
        canActivate: [authenticatedGuard]
    },
    // {
    //     path: 'notifications',
    //     loadComponent: () => import('./layouts/notifications/notifications.component').then(item => item.NotificationsComponent),
    //     canActivate: [authenticationGuard]
    // },
    // {
    //     path: '**',
    //     loadComponent: () => import('./layouts/page-not-found/page-not-found.component').then(item => item.PageNotFoundComponent)
    // }
];
