import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


import { GameService } from './game.service';
import { BASE_API } from '../../../constants/general';


/**
 * Tests the GameService class.
 */
describe('GameService', () => {
    // Fields ---------------------------------------------------------------------
    const baseUrl = `${BASE_API}/games`;

    let service: GameService;
    let mockHttpClient: HttpTestingController;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
        service = TestBed.inject(GameService);
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


    it("should send '/games' PATCH requests", () =>
    {
        const mockResponse = 'Verified successfully';
        const payload = { username: 'johndoe', pin: '1234' };
        service.verifyPlayer(payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toEqual(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/games?category={gameId}' POST requests", () =>
    {
        const mockResponse = 'Submitted successfully';
        const payload = [ { username: 'johndoe', score: 'Win' }, { username: 'janesmith', score: 'Loss' } ];
        service.submitGame('test', payload).subscribe(item => {
            expect(item.status).toBe(201);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === baseUrl && item.params.get('category') === 'test');
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 201, statusText: 'Created' });
    });


    it("should send '/games?category={gameId}' GET requests", () =>
    {
        const mockResponse = [ { id: 1, organiser: 'johndoe', standing: 'Loss', scores: [ { username: 'johndoe', score: 'Loss' }, { username: 'janesmith', score: 'Win' } ], played: '2026-01-01T00:00:00Z', updated: null } ];
        service.fetchGames('test').subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === baseUrl && item.params.get('category') === 'test');
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/games?vaultId={gameId}' GET requests", () =>
    {
        const mockResponse = { id: 1, organiser: 'johndoe', standing: 'Win', scores: [ { username: 'johndoe', score: 'Win' }, { username: 'janesmith', score: 'Loss' } ], played: '2026-01-05T18:30:00Z', updated: '2026-01-12T20:15:00Z' };
        service.fetchGame(1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === baseUrl && item.params.get('vaultId') === '1');
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/games?category={gameId}&vaultId={vaultId}' DELETE requests", () =>
    {
        const mockResponse = 'Deleted successfully';
        service.requestGameDeletion('test', 1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === baseUrl
            && item.params.get('category') === 'test'
            && item.params.get('vaultId') === '1');
        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });
});
