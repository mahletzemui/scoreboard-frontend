import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


import { BASE_API } from '../../../constants/general';

import { Task } from '../../../models/responses';


/**
 * Manages backend task operations in the application.
 */
@Injectable({
    providedIn: 'root'
})
export class TaskService {
    // Fields ---------------------------------------------------------------------
    private base = BASE_API + '/tasks';

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new TaskService object.
     *
     * @param http - HTTP request/response handler.
     */
    constructor(private http: HttpClient) { }

    // Methods --------------------------------------------------------------------

    /**
     * Initiates a fetch tasks request with the server.
     *
     * @return an http response observable with the user's tasks.
     */
    fetchTasks(): Observable<HttpResponse<Task[]>> {
        return this.http.get<Task[]>(`${this.base}`, { observe: 'response', responseType: 'json', withCredentials: true });
    }

    /**
     * Initiates an update vote request with the server.
     *
     * @param reviewId - Id of vote to update.
     * @param status   - Status to update to.
     *
     * @return an http response observable with the user's updated task.
     */
    updateVote(reviewId: number, status: 'approved'|'pending'|'rejected'): Observable<HttpResponse<Task>> {
        return this.http.patch<Task>(`${this.base}/votes/${reviewId}`, status, { observe: 'response', responseType: 'json', withCredentials: true });
    }

    /**
     * Initiates a cancel task request with the server.
     *
     * @param taskId - Id of task to cancel.
     *
     * @return an http response observable with the server's response.
     */
    cancelTask(taskId: number): Observable<HttpResponse<string>> {
        return this.http.delete(`${this.base}/${taskId}`, { observe: 'response', responseType: 'text', withCredentials: true });
    }
}
