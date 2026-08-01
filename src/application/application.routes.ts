import { Routes } from '@angular/router';


import { authenticationGuard } from './services/guards/authentication.guard';


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
        loadComponent: () => import('./layouts/access/access.component').then(m => m.AccessComponent)
    },
    {
        path: 'register',
        data: { view: 'register' },
        loadComponent: () => import('./layouts/access/access.component').then(m => m.AccessComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () => import('./layouts/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./layouts/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },
    // {
    //     path: 'dashboard',
    //     loadComponent: () => import('./layouts/dashboard/dashboard.component').then(m => m.DashboardComponent),
    //     canActivate: [authenticationGuard]
    // },
    // {
    //     path: 'games',
    //     canActivate: [authenticationGuard],
    //     children: [
    //         {
    //             path:'connect4',
    //             children: [
    //                 {
    //                     path:'recap',
    //                     loadComponent: () => import('./layouts/game-recaps').then(m => m.Connect4RecapComponent)
    //                 },
    //                 {
    //                     path:'play',
    //                     loadComponent: () => import('./layouts/game-play').then(m => m.Connect4PlayComponent)
    //                 }
    //             ]
    //         },
    //         {
    //             path:'conquer',
    //             children: [
    //                 {
    //                     path:'recap',
    //                     loadComponent: () => import('./layouts/game-recaps').then(m => m.ConquerRecapComponent)
    //                 },
    //                 {
    //                     path:'play',
    //                     loadComponent: () => import('./layouts/game-play').then(m => m.ConquerPlayComponent)
    //                 }
    //             ]
    //         },
    //         {
    //             path:'domino',
    //             children: [
    //                 {
    //                     path:'recap',
    //                     loadComponent: () => import('./layouts/game-recaps').then(m => m.DominoRecapComponent)
    //                 },
    //                 {
    //                     path:'play',
    //                     loadComponent: () => import('./layouts/game-play').then(m => m.DominoPlayComponent)
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     path: 'notifications',
    //     loadComponent: () => import('./layouts/notifications/notifications.component').then(m => m.NotificationsComponent),
    //     canActivate: [authenticationGuard]
    // },
    // {
    //     path: 'account',
    //     loadComponent: () => import('./layouts/account/account.component').then(m => m.AccountComponent),
    //     canActivate: [authenticationGuard]
    // },
    // {
    //     path: '**',
    //     loadComponent: () => import('./layouts/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
    // }
];
