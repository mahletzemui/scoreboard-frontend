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
        const mockResponse = [ { id: 1, organiser: 'johndoe', name: 'Does Group', description: 'A group for members of the Doe family to play and keep track of games together.', member: 1 } ];
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


    it("should send '/groups?groupId={groupId}' GET requests", () =>
    {
        const mockResponse = { id: 1, organiser: 'johndoe', name: 'Does Group', description: 'A group for members of the Doe family to play and keep track of games together.', member: 1 };
        service.fetchGroup(1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === `${baseUrl}` && item.params.get('groupId') === '1');
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups?groupId={groupId}' PATCH requests with body", () =>
    {
        const mockResponse = 'Updated successfully!';
        const payload = { name: 'Smiths Crew', description: "A crew for friends in Smiths circle to enjoy competitive Friday game nights together." };
        service.updateGroup(1, payload).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === `${baseUrl}` && item.params.get('groupId') === '1');
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toBe(payload);
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups?groupId={groupId}' PATCH requests without body", () =>
    {
        const mockResponse = 'Processed successfully!';
        service.joinGroup(1).subscribe(item => {
            expect(item.status).toBe(202);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === `${baseUrl}` && item.params.get('groupId') === '1');
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 202, statusText: 'Accepted' });
    });


    it("should send '/groups?memberId={memberId}' DELETE requests", () =>
    {
        const mockResponse = 'Left successfully!';
        service.leaveGroup(1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === `${baseUrl}` && item.params.get('memberId') === '1');
        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/groups?groupId={groupId}' DELETE requests", () =>
    {
        const mockResponse = 'Deleted successfully!';
        service.deleteGroup(1).subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(item => item.url === `${baseUrl}` && item.params.get('groupId') === '1');
        expect(request.request.method).toBe('DELETE');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });
});
