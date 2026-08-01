import { TestBed } from '@angular/core/testing';
import { firstValueFrom, isObservable, of } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';


import { authenticatedGuard } from './authenticated.guard';

import { AuthenticationService } from '../servers/authentication/authentication.service';


/**
 * Tests the AuthenticatedGuard's functionality.
 */
describe('authenticatedGuard', () => {
    // Fields ---------------------------------------------------------------------
    let serverSpy: AuthenticationService;
    let routerSpy: Router;
    
    // Setup ----------------------------------------------------------------------

    const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => authenticatedGuard(...guardParameters));

    beforeEach(() =>
    {
        TestBed.configureTestingModule({});
        serverSpy = TestBed.inject(AuthenticationService);
        routerSpy = TestBed.inject(Router);
        
        localStorage.clear();
        vi.spyOn(serverSpy, 'refresh').mockImplementation(() => of(null));
        vi.spyOn(routerSpy, 'parseUrl').mockReturnValue({} as any);
    });

    // Tests ----------------------------------------------------------------------

    it('should be created', () =>
    {
        expect(executeGuard).toBeTruthy();
    });


    it('should allow access when the session exists', async () =>
    {
        serverSpy.setSession('John', 'johndoe');
        const result = await resolveGuard();

        expect(result).toBe(true);
        expect(serverSpy.refresh).not.toHaveBeenCalled();
    });


    it('should allow access when the session is refreshed', async () =>
    {
        serverSpy.setSession('', '');
        vi.spyOn(serverSpy, 'refresh').mockImplementation(() => {
            serverSpy.setSession('John', 'johndoe');
            return of(null);
        });
        const result = await resolveGuard();

        expect(result).toBe(true);
        expect(serverSpy.refresh).toHaveBeenCalledTimes(1);
        expect(routerSpy.parseUrl).not.toHaveBeenCalled();
    });


    it('should block access when the session is invalid', async () =>
    {
        serverSpy.setSession('', '');
        await resolveGuard();

        expect(serverSpy.refresh).toHaveBeenCalledTimes(1);
        expect(routerSpy.parseUrl).toHaveBeenCalledTimes(1);
        expect(routerSpy.parseUrl).toHaveBeenCalledWith('/login');
    });

    // Helpers --------------------------------------------------------------------

    async function resolveGuard()
    {
        const mockState = {} as RouterStateSnapshot;
        const mockRoute = {} as ActivatedRouteSnapshot;

        const result = TestBed.runInInjectionContext(() => authenticatedGuard(mockRoute, mockState));
        if (isObservable(result)) {
            return await firstValueFrom(result);
        }
        return result;
    }
});
