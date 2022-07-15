import { Injectable } from '@angular/core';
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";
import {Observable} from "rxjs";
import {Auto} from "../api/auto";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError} from "rxjs/operators";
import {AuthService} from "../auth.service";
import {BookmarkRequestModel} from "../model/bookmark-request-model";
import {Bookmark} from "../api/bookmark";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AutoCardService {
  private handleError: HandleError;
  private bookmarkURL: string = 'http://localhost:8080/bookmark/';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + this.auth.getAccessToken()
    })
  };

  existBookmark(id: number): Observable<HttpResponse<Bookmark>> {
    const url = `${environment.apiUrl}/bookmark/exists/${id}`;
    return this.http.get<Bookmark>(url, {headers: this.httpOptions.headers, observe: 'response'})
  }

  updateBookmark(request: BookmarkRequestModel): Observable<HttpResponse<Bookmark>> {
    const url = `${environment.apiUrl}/bookmark/`;
    return this.http.post<Bookmark>(url, request,{headers: this.httpOptions.headers, observe: 'response'})
  }


  constructor(
    private http: HttpClient,
    private auth: AuthService,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('AutoService');
  }
}
