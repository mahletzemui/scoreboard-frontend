import { map } from 'rxjs';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


import { AuthenticationService } from '../servers/authentication/authentication.service';


/**
 * Manages the application's access to routes based on authentication.
 *
 * @return true if accessible, else false.
 */
export const authenticationGuard: CanActivateFn = () =>
{
    const server = inject(AuthenticationService);
    if (server.synchronizeSession()) {
        return true;
    }

    const router = inject(Router);
    return server.refresh().pipe(map(() => {
        return server.preferredName() ? true : router.parseUrl('/login');
    }));
};
