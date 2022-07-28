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
import {AuthService} from "../auth.service";
import {Bookmark} from "../api/bookmark";



@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  private handleError: HandleError;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  };
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    httpErrorHandler: HttpErrorHandler)
  {
    this.handleError = httpErrorHandler.createHandleError('ResultService');
  }

  //page=${page}&limit=${limit}
  getResults(query:String): Observable<Page> {
    let url = `http://localhost:8080/auto/search/${encodeURI(query.toString())}`;

    return this.http.get<Page>(url,this.httpOptions).pipe(
      catchError(this.handleError<Page>(`getResults`))
    );}

  getMakes(): Observable<[Make]> {
    let url = `http://localhost:8080/make/all`;
    return this.http.get<[Make]>(url, this.httpOptions).pipe(
      catchError(this.handleError<[Make]>(`getMakes`))
    );}

  getBodyTypes(): Observable<[BodyType]> {
    let url = `http://localhost:8080/body/type/all`;
    return this.http.get<[BodyType]>(url, this.httpOptions).pipe(
      catchError(this.handleError<[BodyType]>(`getBodyTypes`))
    );}

  getFuelTypes(): Observable<[Fuel]> {
    let url = `http://localhost:8080/auto/fuel/all`;
    return this.http.get<[Fuel]>(url, this.httpOptions).pipe(
      catchError(this.handleError<[Fuel]>(`getFuelTypes`))
    );
  }

  getColors(): Observable<[Color]> {
    let url = `http://localhost:8080/auto/color/all`;
    return this.http.get<[Color]>(url, this.httpOptions).pipe(
      catchError(this.handleError<[Color]>(`getColors`))
    );
  }

  getDrivetrain(): Observable<[Drivetrain]> {
    let url = `http://localhost:8080/auto/drivetrain/all`;
    return this.http.get<[Drivetrain]>(url, this.httpOptions).pipe(
      catchError(this.handleError<[Drivetrain]>(`getDrivetrain`))
    );
  }

  getTransmissions(): Observable<[Transmission]> {
    let url = `http://localhost:8080/auto/transmission/all`;
    return this.http.get<[Transmission]>(url, this.httpOptions).pipe(
      catchError(this.handleError<[Transmission]>(`getTransmissions`))
    );
  }

  getBookmarks(): Observable<[Bookmark]> {
    const httpOptionsBookmark = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + this.auth.getAccessToken()
      })
    };

    let url = `http://localhost:8080/bookmark/watchlist/all`;
    return this.http.get<[Bookmark]>(url, httpOptionsBookmark).pipe(
      catchError(this.handleError<[Bookmark]>(`getBookmarks`))
    );
  }
}
