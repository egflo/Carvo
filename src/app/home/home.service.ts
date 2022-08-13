import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Make} from "../api/make";
import {environment} from "../../environments/environment";
import {BodyType} from "../api/body-type";

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

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HomeService');
  }

  getAllMake(): Observable<[Make]> {
    const url = `${environment.apiUrl}/make/all`;
    return this.http.get<[Make]>(url, httpOptions).pipe(
      catchError(this.handleError<[Make]>(`getAllMake`))
    );
  }

  getAllTypes(): Observable<[BodyType]> {
    let url = `${environment.apiUrl}/body/type/all`;
    return this.http.get<[BodyType]>(url, httpOptions).pipe(
      catchError(this.handleError<[BodyType]>(`getAllTypes`))
    );
  }

  getAllModelsFromMake(make: String): Observable<[String]> {
    return this.http.get<[String]>(`${environment.apiUrl}/auto/${make}/model/all`, httpOptions).pipe(
      catchError(this.handleError<[String]>(`getAllModelsFromMake`))
    );
  }
}
