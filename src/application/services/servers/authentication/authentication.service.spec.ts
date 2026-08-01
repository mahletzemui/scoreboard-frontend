import { firstValueFrom } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


import { BASE_API } from '../../../constants/general';
import { AuthenticationService } from './authentication.service';


/**
 * Tests the AuthenticationService class.
 */
describe('AuthenticationService', () => {
    // Fields ---------------------------------------------------------------------
    let service: AuthenticationService;
    let mockHttpClient: HttpTestingController;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
        service = TestBed.inject(AuthenticationService);
        mockHttpClient = TestBed.inject(HttpTestingController);
    });

    afterEach(() =>
    {
        mockHttpClient.verify();
    });

    // Tests ----------------------------------------------------------------------

    it('should create service', () =>
    {
        expect(service).toBeTruthy();
    });


    describe('Session', () => {
        beforeEach(() =>
        {
            localStorage.clear();
            vi.spyOn(console, 'error');
            vi.spyOn(Storage.prototype, 'setItem');
        });

        // ----------------------------------------------------------------------------

        it('should retrieve/update session details', () =>
        {
            expect(service.synchronizeSession()).toBe('');
            expect(service.preferredName()).toBe('');
            expect(localStorage.setItem).toHaveBeenCalledWith('name', '');
            expect(localStorage.setItem).toHaveBeenCalledWith('username', '');

            service.setSession('John', 'johndoe');
            expect(service.synchronizeSession()).toBe('John');
            expect(service.preferredName()).toBe('John');
            expect(localStorage.setItem).toHaveBeenCalledWith('name', 'John');
            expect(localStorage.setItem).toHaveBeenCalledWith('username', 'johndoe');

            service.setSession('', '');
            expect(service.synchronizeSession()).toBe('');
            expect(service.preferredName()).toBe('');
            expect(localStorage.setItem).toHaveBeenCalledWith('name', '');
            expect(localStorage.setItem).toHaveBeenCalledWith('username', '');
        });


        it('should handle successful refresh attempts with content', async () =>
        {
            const mockResponse = { name: 'John', username: 'johndoe' };
            const result = firstValueFrom(service.refresh());

            const request = mockHttpClient.expectOne(`${BASE_API}/refresh`);
            expect(request.request.method).toBe('GET');
            expect(request.request.body).toBeFalsy();
            expect(request.request.withCredentials).toBe(true);
            request.flush(mockResponse, { status: 200, statusText: 'Ok' });

            const response = await result;
            expect(response?.status).toBe(200);
            expect(response?.body).toEqual(mockResponse);
            expect(service.preferredName()).toBe('John');
            expect(console.error).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalledTimes(2);
            expect(localStorage.setItem).toHaveBeenCalledWith('name', 'John');
            expect(localStorage.setItem).toHaveBeenCalledWith('username', 'johndoe');
        });


        it('should handle successful refresh attempts without content', async () =>
        {
            const result = firstValueFrom(service.refresh());

            const request = mockHttpClient.expectOne(`${BASE_API}/refresh`);
            expect(request.request.method).toBe('GET');
            expect(request.request.body).toBeFalsy();
            expect(request.request.withCredentials).toBe(true);
            request.flush(null, { status: 200, statusText: 'Ok' });

            const response = await result;
            expect(response?.status).toBe(200);
            expect(response?.body).toBeFalsy();
            expect(service.preferredName()).toBe('');
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(localStorage.setItem).toHaveBeenCalledTimes(2);
            expect(localStorage.setItem).toHaveBeenCalledWith('name', '');
            expect(localStorage.setItem).toHaveBeenCalledWith('username', '');
        });


        it('should handle unauthorized refresh attempts', async () =>
        {
            const result = firstValueFrom(service.refresh());

            const request = mockHttpClient.expectOne(`${BASE_API}/refresh`);
            expect(request.request.method).toBe('GET');
            expect(request.request.body).toBeFalsy();
            expect(request.request.withCredentials).toBe(true);
            request.flush(null, { status: 401, statusText: 'Unauthorized' });

            const response = await result;
            expect(response).toBeFalsy();
            expect(service.preferredName()).toBe('');
            expect(console.error).not.toHaveBeenCalled();
            expect(localStorage.setItem).toHaveBeenCalledTimes(2);
            expect(localStorage.setItem).toHaveBeenCalledWith('name', '');
            expect(localStorage.setItem).toHaveBeenCalledWith('username', '');
        });

        
        it('should handle refresh attempts with unknown API errors', async () =>
        {
            const result = firstValueFrom(service.refresh());
            
            const request = mockHttpClient.expectOne(`${BASE_API}/refresh`);
            expect(request.request.method).toBe('GET');
            expect(request.request.body).toBeFalsy();
            expect(request.request.withCredentials).toBe(true);
            request.flush(null, { status: 500, statusText: 'Server Error' });

            const response = await result;
            expect(response).toBeFalsy();
            expect(service.preferredName()).toBe('');
            expect(console.error).toHaveBeenCalledTimes(1);
            expect(localStorage.setItem).toHaveBeenCalledTimes(2);
            expect(localStorage.setItem).toHaveBeenCalledWith('name', '');
            expect(localStorage.setItem).toHaveBeenCalledWith('username', '');
        });
    });


    it("should send '/login' POST requests", () =>
    {
        const mockResponse = 'Logged in successfully';
        const payload = { username: 'johndoe', password: 'j123456!' };
        service.login(payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${BASE_API}/login`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/register' POST requests", () =>
    {
        const mockResponse = 'Registered successfully';
        const payload = { pname: 'John', username: 'johndoe', email: 'johndoe@email.com', password: 'j123456!', pin: '1234' };
        service.register(payload).subscribe(item => {
            expect(item.status).toBe(201);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${BASE_API}/register`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 201, statusText: 'Created' });
    });


    it("should send '/forgot-password' POST requests", () =>
    {
        const mockResponse = 'Forgot password successfully';
        const payload = { username: 'johndoe' };
        service.forgotPassword(payload).subscribe(item => {
            expect(item.status).toBe(202);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${BASE_API}/forgot-password`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        request.flush(mockResponse, { status: 202, statusText: 'Accepted' });
    });


    it("should send '/reset-password?token={token}' PATCH requests", () =>
    {
        const mockResponse = 'Reset password successfully';
        const payload = { password: '!654321j' };
        service.resetPassword("123-456-789", payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${BASE_API}/reset-password?token=123-456-789`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual(payload);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/logout' POST requests", () =>
    {
        const mockResponse = 'Logged out successfully';
        service.logout().subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${BASE_API}/logout`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });
});
