import {Injectable, Optional} from '@angular/core';
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";
import {Page} from "../api/page";
import {Make} from "../api/make";
import {BodyType} from "../api/body-type";
import {Fuel} from "../api/fuel";
import {Color} from "../api/color";
import {Drivetrain} from "../api/drivetrain";
import {Transmission} from "../api/transmission";


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


  //page=${page}&limit=${limit}
  getResults(query:String): Observable<Page> {
    let url = `http://localhost:8080/auto/search/${encodeURI(query.toString())}`;
    console.log(url);
    return this.http.get<Page>(url, httpOptions).pipe(
      catchError(this.handleError<Page>(`getResults`))
    );}

  getMakes(): Observable<[Make]> {
    let url = `http://localhost:8080/make/all`;
    return this.http.get<[Make]>(url, httpOptions).pipe(
      catchError(this.handleError<[Make]>(`getMakes`))
    );}

  getBodyTypes(): Observable<[BodyType]> {
    let url = `http://localhost:8080/body/type/all`;
    return this.http.get<[BodyType]>(url, httpOptions).pipe(
      catchError(this.handleError<[BodyType]>(`getBodyTypes`))
    );}

  getFuelTypes(): Observable<[Fuel]> {
    let url = `http://localhost:8080/auto/fuel/all`;
    return this.http.get<[Fuel]>(url, httpOptions).pipe(
      catchError(this.handleError<[Fuel]>(`getFuelTypes`))
    );
  }

  getColors(): Observable<[Color]> {
    let url = `http://localhost:8080/auto/color/all`;
    return this.http.get<[Color]>(url, httpOptions).pipe(
      catchError(this.handleError<[Color]>(`getColors`))
    );
  }

  getDrivetrain(): Observable<[Drivetrain]> {
    let url = `http://localhost:8080/auto/drivetrain/all`;
    return this.http.get<[Drivetrain]>(url, httpOptions).pipe(
      catchError(this.handleError<[Drivetrain]>(`getDrivetrain`))
    );
  }

  getTransmissions(): Observable<[Transmission]> {
    let url = `http://localhost:8080/auto/transmission/all`;
    return this.http.get<[Transmission]>(url, httpOptions).pipe(
      catchError(this.handleError<[Transmission]>(`getTransmissions`))
    );
  }

}
