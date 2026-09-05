import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';


import { TaskService } from './task.service';
import { BASE_API } from '../../../constants/general';


/**
 * Tests the TaskService class.
 */
describe('TaskService', () => {
    // Fields ---------------------------------------------------------------------
    const baseUrl = `${BASE_API}/tasks`;

    let service: TaskService;
    let mockHttpClient: HttpTestingController;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
        service = TestBed.inject(TaskService);
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


    it("should send '/tasks' GET requests", () =>
    {
        const mockResponse = [ { id: 1, seeker: 'johndoe', action: 'Join Family', reference: 1, previous: 'Family #1 wants to be joined by janesmith.', current: '', verdict: 'Pending', reviewers: [ { id: 1, reporter: 'johndoe', verdict: 'Pending' } ] } ];
        service.fetchTasks().subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}`);
        expect(request.request.method).toBe('GET');
        expect(request.request.body).toBeFalsy();
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/tasks/votes/{reviewId}' PATCH requests", () =>
    {
        const mockResponse = { id: 1, seeker: 'johndoe', action: 'Join Family', reference: 1, previous: 'Family #1 wants to be joined by janesmith.', current: '', verdict: 'Approved', reviewers: [ { id: 1, reporter: 'johndoe', verdict: 'Approved' } ] };
        service.updateVote(1, 'approved').subscribe(item => {
            expect(item.status).toBe(200);
            expect(item.body).toBe(mockResponse);
        });

        const request = mockHttpClient.expectOne(`${baseUrl}/votes/1`);
        expect(request.request.method).toBe('PATCH');
        expect(request.request.body).toBe('approved');
        expect(request.request.withCredentials).toBe(true);
        request.flush(mockResponse, { status: 200, statusText: 'Ok' });
    });


    it("should send '/tasks/{taskId}' DELETE requests", () =>
    {
        const mockResponse = 'Task has been successfully cancelled.';
        service.cancelTask(1).subscribe(item => {
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
