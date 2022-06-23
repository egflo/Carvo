import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Make} from "../api/make";

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
export class HomeService {
  private handleError: HandleError;
  private makeURL: string = 'http://localhost:8080/make/all';

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HomeService');
  }

  getAllMake(): Observable<[Make]> {//const url = `${this.autosUrl}/${id}`;
    return this.http.get<[Make]>(this.makeURL, httpOptions).pipe(
      catchError(this.handleError<[Make]>(`getAllMake`))
    );
  }

  getAllModelsFromMake(make: String): Observable<[String]> {
    return this.http.get<[String]>(`http://localhost:8080/auto/${make}/model/all`, httpOptions).pipe(
      catchError(this.handleError<[String]>(`getAllModelsFromMake`))
    );
  }
}
