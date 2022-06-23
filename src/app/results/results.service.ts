import { Injectable } from '@angular/core';
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Page} from "../api/page";


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
export class ResultsService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('ResultService');
  }

  getResults(page: Number, limit: Number): Observable<Page> {
    let url = `http://localhost:8080/auto/make/bmw/?page=${page}&limit=${limit}`;
    return this.http.get<Page>(url, httpOptions).pipe(
      catchError(this.handleError<Page>(`getResults`))
    );}
}
