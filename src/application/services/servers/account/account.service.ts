import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';


import { BASE_API } from '../../../constants/general';

import { Password, Pin } from '../../../models/requests';
import { Profile, Session } from '../../../models/responses';
import { AuthenticationService } from '../authentication/authentication.service';


/**
 * Manages backend account operations in the application.
 */
@Injectable({
    providedIn: 'root'
})
export class AccountService {
    // Fields ---------------------------------------------------------------------
    private base = BASE_API + '/account';

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new AccountService object.
     * 
     * @param authentication - Authentication handler.
     * @param http           - HTTP request/response handler.
     */
    constructor(private authentication: AuthenticationService, private http: HttpClient) { }

    // Methods --------------------------------------------------------------------
    
    /**
     * Updates the session details.
     * 
     * @param name     - Name to update to.
     * @param username - Username to update to.
     */
    updateSession(name: string, username: string): void
    {
        this.authentication.setSession(name, username);
    }

    /**
     * Initiates a fetch profile request with the server.
     * 
     * @return an http response observable with the user's profile.
     */
    fetchProfile(): Observable<HttpResponse<Profile>> {
        return this.http.get<Profile>(`${this.base}/profile`, { observe: 'response', responseType: 'json', withCredentials: true });
    }

    /**
     * Initiates an update profile request with the server.
     * 
     * @param detail - New profile information.
     * 
     * @return an http response observable with the server's updated session.
     */
    updateProfile(detail: Profile): Observable<HttpResponse<Session>> {
        return this.http.patch<Session>(`${this.base}/profile`, detail, { observe: 'response', responseType: 'json', withCredentials: true });
    }

    /**
     * Initiates an update password request with the server.
     * 
     * @param detail - New password information.
     * 
     * @return an http response observable with the server's response.
     */
    updatePassword(detail: Password): Observable<HttpResponse<string>> {
        return this.http.patch(`${this.base}/password`, detail, { observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates an update pin request with the server.
     * 
     * @param detail - New pin information.
     * 
     * @return an http response observable with the server's response.
     */
    updatePin(detail: Pin): Observable<HttpResponse<string>> {
        return this.http.patch(`${this.base}/pin`, detail, { observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a disable account request with the server.
     * 
     * @return an http response observable with the server's response.
     */
    disableAccount(): Observable<HttpResponse<string>> {
        return this.http.delete(`${this.base}`, { observe: 'response', responseType: 'text', withCredentials: true });
    }
}
