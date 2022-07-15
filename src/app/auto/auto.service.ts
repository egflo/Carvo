import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {Observable} from "rxjs";
import {Auto} from "../api/auto";
import {catchError} from "rxjs/operators";
import {AuthService} from "../auth.service";
import {environment} from "../../environments/environment";
import {BookmarkRequestModel} from "../model/bookmark-request-model";
import {Bookmark} from "../api/bookmark";
import {Response} from "../api/response";

@Injectable({
  providedIn: 'root'
})
export class AutoService {
  private handleError: HandleError;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.auth.getAccessToken()
    })
  };

  private httpOptionsAnon = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  };

  /** Get Auto by id. Will 404 if id not found */
  getAuto(id: number): Observable<HttpResponse<Auto>> {//const url = `${this.autosUrl}/${id}`;
    const url = `${environment.apiUrl}/auto/${id}`;
    console.log("getAuto: " + url);
    return this.http.get<Auto>(
      url, {headers: this.httpOptionsAnon.headers, observe: 'response'})
    //return this.http.get<Auto>(url, this.httpOptions).pipe(
     // catchError(this.handleError<Auto>(`getAuto id=${id}`))
    //);
  }

  existBookmark(id: Number): Observable<HttpResponse<Bookmark>> {
    const url = `${environment.apiUrl}/bookmark/exists/${id}`;
    console.log("existBookmark: " + url);
    return this.http.get<Bookmark>(
      url, {headers: this.httpOptions.headers, observe: 'response'})
  }

  addBookmark(request: BookmarkRequestModel): Observable<HttpResponse<Bookmark>> {
    const url = `${environment.apiUrl}/bookmark/`;
    return this.http.post<Bookmark>(
      url, request,{headers: this.httpOptions.headers, observe: 'response'})

    //return this.http.post<HttpResponse<Bookmark>>(url, request, this.httpOptions).pipe(
    //  catchError(this.handleError<HttpResponse<Bookmark>>('addBookmark'))
    //);
  }

  removeBookmark(request: BookmarkRequestModel): Observable<any> {
    const url = `${environment.apiUrl}/bookmark/${request.id}`;
    const requestOptions: Object = {
      headers: this.httpOptions.headers,
      observe: 'response',
      responseType: 'text'
    }
    return this.http.delete<any>(
      url, requestOptions)
   // return this.http.delete<HttpResponse<Bookmark>>(url, this.httpOptions).pipe(
      //catchError(this.handleError<HttpResponse<Bookmark>>('removeBookmark'))
    //);
  }

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AutoService');
  }
}
