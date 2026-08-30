import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';


import { BASE_API } from '../../../constants/general';

import { Vault } from '../../../models/responses';
import { Scorecard, Verification } from '../../../models/requests';


/**
 * Manages backend game operations in the application.
 */
@Injectable({
    providedIn: 'root'
})
export class GameService {
    // Fields ---------------------------------------------------------------------
    private base = BASE_API + '/games';

    // Constructors ---------------------------------------------------------------

    /**
     * Creates a new GameService object.
     * 
     * @param http - HTTP request/response handler.
     */
    constructor(private http: HttpClient) { }

    // Methods --------------------------------------------------------------------

    /**
     * Initiates a verify player request with the server.
     * 
     * @param detail - Verification information to send.
     * 
     * @return an http response observable with the server's response.
     */
    verifyPlayer(detail: Verification): Observable<HttpResponse<string>> {
        return this.http.patch(`${this.base}`, detail, { observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a submit game scores request with the server.
     * 
     * @param gameId - Id of game to submit for.
     * @param detail - Score information to submit.
     * 
     * @return an http response observable with the server's response.
     */
    submitGame(gameId: string, detail: Scorecard): Observable<HttpResponse<string>> {
        const params = new HttpParams().set('category', gameId);
        return this.http.post(`${this.base}`, detail, { params, observe: 'response', responseType: 'text', withCredentials: true });
    }

    /**
     * Initiates a fetch game scores request with the server.
     *
     * @param gameId - Id of game to fetch.
     *
     * @return an http response observable with the user's scores.
     */
    fetchGames(gameId: string): Observable<HttpResponse<Vault[]>> {
        const params = new HttpParams().set('category', gameId);
        return this.http.get<Vault[]>(`${this.base}`, { params, observe: 'response', responseType: 'json', withCredentials: true });
    }

    /**
     * Initiates a delete game request with the server.
     *
     * @param gameId  - Id of game to delete.
     * @param vaultId - Id of vault to delete.
     *
     * @return an http response observable with the server's response.
     */
    requestGameDeletion(gameId: string, vaultId: number): Observable<HttpResponse<string>> {
        const params = new HttpParams().set('category', gameId)
                                       .set('vaultId', vaultId.toString());
        return this.http.delete(`${this.base}`, { params, observe: 'response', responseType: 'text', withCredentials: true });
    }
}
