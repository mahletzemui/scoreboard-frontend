import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


import { GroupService } from './group.service';
import { BASE_API } from '../../../constants/general';


/**
 * Tests the GroupService class.
 */
describe('GroupService', () => {
    // Fields ---------------------------------------------------------------------
    const baseUrl = `${BASE_API}/groups`;

    let service: GroupService;
    let mockHttpClient: HttpTestingController;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
        service = TestBed.inject(GroupService);
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


    it("should send '/groups' GET requests", () =>
    {
        const mockResponse = [ { id: 1, organiser: 'johndoe', name: 'Does Group', description: 'A group for members of the Doe family to play and keep track of games together.', membershipId: 1, members: [] } ];
        service.fetchGroups().subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}`);
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups' POST requests", () =>
    {
        const mockResponse = 'Created successfully!';
        const payload = { name: 'Does Group', description: 'A group for members of the Doe family to play and keep track of games together.' };
        service.createFamily(payload).subscribe(item => {
            expect(item.status).toBe(201);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toBe(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 201, statusText: 'Created' });
    });


    it("should send '/groups/{groupId}' GET requests", () =>
    {
        const mockResponse = { id: 1, organiser: 'johndoe', name: 'Does Group', description: 'A group for members of the Doe family to play and keep track of games together.', membershipId: 1, members: [ 'johndoe', 'mikejohnson' ] };
        service.fetchGroup(1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/1`);
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups/{groupId}' PATCH requests", () =>
    {
        const mockResponse = 'Updated successfully!';
        const payload = { name: 'Smiths Crew', description: "A crew for friends in Smiths circle to enjoy competitive Friday game nights together." };
        service.updateGroup(1, payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/1`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toBe(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups/{groupId}/standings?category={gameId}' GET requests", () =>
    {
        const mockResponse = [ { player: 'johndoe', standings: [ 'Win', 'Loss' ] } ];
        service.fetchStandings(1, 'test').subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === `${baseUrl}/1/standings` && item.params.get('category') === 'test');
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups/{groupId}/memberships' POST requests", () =>
    {
        const mockResponse = 'Processed successfully!';
        service.joinGroup(1).subscribe(item => {
            expect(item.status).toBe(202);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/1/memberships`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 202, statusText: 'Accepted' });
    });


    it("should send '/groups/members/{membershipId}' DELETE requests", () =>
    {
        const mockResponse = 'Left successfully!';
        service.leaveGroup(1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/members/1`);
        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups/{groupId}' DELETE requests", () =>
    {
        const mockResponse = 'Deleted successfully!';
        service.deleteGroup(1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/1`);
        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });
});
