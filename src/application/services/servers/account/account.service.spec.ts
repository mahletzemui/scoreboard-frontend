import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


import { AccountService } from './account.service';
import { BASE_API } from '../../../constants/general';

import { AuthenticationService } from '../authentication/authentication.service';


/**
 * Tests the AccountService class.
 */
describe('AccountService', () => {
    // Fields ---------------------------------------------------------------------
    const baseUrl = `${BASE_API}/account`;

    let service: AccountService;
    let authenticationService: AuthenticationService;
    let mockHttpClient: HttpTestingController;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({ providers: [AuthenticationService, provideHttpClient(), provideHttpClientTesting()] });
        service = TestBed.inject(AccountService);
        authenticationService = TestBed.inject(AuthenticationService);
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


    it('should update the session', () => {
        vi.spyOn(authenticationService, 'setSession');
        service.updateSession('Jane', 'janesmith');
        expect(authenticationService.setSession).toHaveBeenCalledTimes(1);
        expect(authenticationService.setSession).toHaveBeenCalledWith('Jane', 'janesmith');
    });


    it("should send '/account/profile' GET requests", () =>
    {
        const mockResponse = { pname: 'John', username: 'johndoe', email: 'johndoe@email.com' };
        service.fetchProfile().subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/profile`);
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/account/profile' PATCH requests", () =>
    {
        const mockResponse = { name: 'Jane', username: 'janedoe' };
        const payload = { pname: 'Jane', username: 'janedoe', email: 'janedoe@email.com' };
        service.updateProfile(payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/profile`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/account/password' PATCH requests", () =>
    {
        const mockResponse = 'Changed successfully';
        const payload = { password: '!654321j' };
        service.updatePassword(payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/password`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/account/pin' PATCH requests", () =>
    {
        const mockResponse = 'Changed successfully';
        const payload = { pin: '4321' };
        service.updatePin(payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/pin`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/account' DELETE requests", () =>
    {
        const mockResponse = 'Disabled successfully';
        service.disableAccount().subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}`);
        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });
});
