import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {Observable} from "rxjs";
import {Page} from "../api/page";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private handleError: HandleError;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.auth.getAccessToken()
    })
  };

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('WatchlistService');
  }

  getWatchlist(page: Number): Observable<Page> {
    let url = `${environment.apiUrl}/bookmark/all?page=${page}&limit=5`;
    return this.http.get<Page>(url, this.httpOptions).pipe(
      catchError(this.handleError<Page>(`getFavorite`))
    );}
}
