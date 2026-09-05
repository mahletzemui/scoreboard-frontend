import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';


import { BASE_API } from '../../../constants/general';

import { Session } from '../../../models/responses';
import { Identity, Login, Password, Register } from '../../../models/requests';


/**
 * Manages backend authentication operations in the application.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    // Fields ---------------------------------------------------------------------
    private preferredNameSignal = signal<string>('');
    readonly preferredName = this.preferredNameSignal.asReadonly();

    private usernameSignal = signal<string>('');

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new AuthenticationService object.
     * 
     * @param http - HTTP request/response handler.
     */
    constructor(private http: HttpClient) { }

    // Methods --------------------------------------------------------------------

    /**
     * Synchronizes the current session with the local state.
     * 
     * @return the correponding session's name.
     */
    synchronizeSession(): string
    {
        localStorage.setItem('name', this.preferredNameSignal());
        localStorage.setItem('username', this.usernameSignal());
        return this.preferredNameSignal();
    }

    /**
     * Sets the current session's details.
     * 
     * @param name     - Name to set to.
     * @param username - Username to set to.
     */
    setSession(name: string, username: string): void
    {
        this.preferredNameSignal.set(name);
        localStorage.setItem('name', name);

        this.usernameSignal.set(username);
        localStorage.setItem('username', username);
    }
    
    /**
     * Initiates a session refresh request with the server.
     * 
     * @return an http response observable with the current session.
     */
    refresh(): Observable<HttpResponse<Session>|null>
    {
        console.log('Authentication: Initiated...');
        return this.http.get<Session>(`${BASE_API}/refresh`, { observe: 'response', withCredentials: true })
                .pipe(tap(response => {
                    const { name, username } = response.body ?? { name: '', username: '' };
                    if (!name || !username) {
                        console.error('Authentication (cont.): Details are not present despite a successful response.');
                    }
                    this.setSession(name, username);
                }), catchError(error => {
                    const code = error.status;
                    if (code !== 401) {
                        console.error(`Authentication (cont.): Denied because of an unexpected error - '${code}': '${error.message}'.`);
                    }
                    this.setSession('', '');
                    return of(null);
        }));
    }

    /**
     * Initiates a login request with the server.
     * 
     * @param detail - Login information to send.
     * 
     * @return an http response observable with the server's response.
     */
    login(detail: Login): Observable<HttpResponse<string>> {
        return this.http.post(`${BASE_API}/login`, detail, { observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a registration request with the server.
     * 
     * @param detail - Registration information to send.
     * 
     * @return an http response observable with the server's response.
     */
    register(detail: Register): Observable<HttpResponse<string>> {
        return this.http.post(`${BASE_API}/register`, detail, { observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a forgot password request with the server.
     * 
     * @param detail - Identity information to send.
     * 
     * @return an http response observable with the server's response.
     */
    forgotPassword(detail: Identity): Observable<HttpResponse<string>> {
        return this.http.post(`${BASE_API}/forgot-password`, detail, { observe: 'response', responseType: 'text' });
    }

    /**
     * Initiates a reset password request with the server.
     * 
     * @param token  - Verification token for reset.
     * @param detail - New password information to reset to.
     * 
     * @return an http response observable with the server's response.
     */
    resetPassword(token: string, detail: Password): Observable<HttpResponse<string>> {
        const params = new HttpParams().set('token', token);
        return this.http.patch(`${BASE_API}/reset-password`, detail, { params, observe: 'response', responseType: 'text' });
    }

    /**
     * Initiates a logout request with the server.
     * 
     * @return an http response observable with the server's response.
     */
    logout(): Observable<HttpResponse<string>> {
        return this.http.post(`${BASE_API}/logout`, null, { observe: 'response', responseType: 'text', withCredentials: true });
    }
}
