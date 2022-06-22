import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {Observable} from "rxjs";
import {Auto} from "../api/auto";
import {catchError} from "rxjs/operators";



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AutoService {
  private handleError: HandleError;
  private autosUrl: string = 'http://localhost:8080/auto/';

  /** Get Auto by id. Will 404 if id not found */
  getAuto(id: number): Observable<Auto> {//const url = `${this.autosUrl}/${id}`;
    const url = `${this.autosUrl}/${id}`;

    return this.http.get<Auto>(this.autosUrl + id, httpOptions).pipe(
      catchError(this.handleError<Auto>(`getAuto id=${id}`))
    );
  }

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AutoService');
  }
}
