import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {AuthService} from "../auth.service";
import {HandleError, HttpErrorHandler} from "../http-error-handler.service";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    httpErrorHandler: HttpErrorHandler)
  {
    this.handleError = httpErrorHandler.createHandleError('ResultService');
  }

  saveSearch(query:string, description: string): Observable<any> {

    const http = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + this.auth.getAccessToken()
      })
    }

    let data = {
      description: description,
      query: query,
      date: new Date()
    }

    console.log(data);

    let url = `${environment.apiUrl}/search/`;
    return this.http.post(url, data, http).pipe(
      catchError(this.handleError<any>(`saveSearch`))
    );
  }
}
