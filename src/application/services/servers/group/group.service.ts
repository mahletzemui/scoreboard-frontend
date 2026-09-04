import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';


import { BASE_API } from '../../../constants/general';

import { Family } from '../../../models/requests';
import { Group } from '../../../models/responses';


/**
 * Manages backend group operations in the application.
 */
@Injectable({
    providedIn: 'root'
})
export class GroupService {
    // Fields ---------------------------------------------------------------------
    private base = BASE_API + '/groups';

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new GroupService object.
     *
     * @param http - HTTP request/response handler.
     */
    constructor(private http: HttpClient) { }

    // Methods --------------------------------------------------------------------

    /**
     * Initiates a fetch groups request with the server.
     *
     * @return an http response observable with all active groups.
     */
    fetchGroups(): Observable<HttpResponse<Group[]>> {
        return this.http.get<Group[]>(`${this.base}`, { observe: 'response', responseType: 'json', withCredentials: true });
    }

    /**
     * Initiates a create family request with the server.
     *
     * @param detail - Family information to create.
     *
     * @return an http response observable with the server's response.
     */
    createFamily(detail: Family): Observable<HttpResponse<string>> {
        return this.http.post(`${this.base}`, detail, { observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a fetch group request with the server.
     *
     * @param groupId - Id of group to fetch.
     *
     * @return an http response observable with the group details.
     */
    fetchGroup(groupId: number): Observable<HttpResponse<Group>> {
        const params = new HttpParams().set('groupId', groupId);
        return this.http.get<Group>(`${this.base}`, { params, observe: 'response', responseType: 'json', withCredentials: true });
    }

    /**
     * Initiates an update group request with the server.
     *
     * @param groupId - Id of group to update.
     * @param detail  - Family information to update to.
     *
     * @return an http response observable with the server's response.
     */
    updateGroup(groupId: number, detail: Family): Observable<HttpResponse<string>> {
        const params = new HttpParams().set('groupId', groupId.toString());
        return this.http.patch(`${this.base}`, detail, { params, observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a join group request with the server.
     *
     * @param groupId - Id of group to join.
     *
     * @return an http response observable with the server's response.
     */
    joinGroup(groupId: number): Observable<HttpResponse<string>> {
        const params = new HttpParams().set('groupId', groupId);
        return this.http.patch(`${this.base}`, null, { params, observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a leave group request with the server.
     *
     * @param memberId - Id of membership to discard.
     *
     * @return an http response observable with the server's response.
     */
    leaveGroup(memberId: number): Observable<HttpResponse<string>> {
        const params = new HttpParams().set('memberId', memberId);
        return this.http.delete(`${this.base}`, { params, observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a delete group request with the server.
     *
     * @param groupId - Id of group to delete.
     *
     * @return an http response observable with the server's response.
     */
    deleteGroup(groupId: number): Observable<HttpResponse<string>> {
        const params = new HttpParams().set('groupId', groupId.toString());
        return this.http.delete(`${this.base}`, { params, observe: 'response', responseType: 'text', withCredentials: true });
    }
}
