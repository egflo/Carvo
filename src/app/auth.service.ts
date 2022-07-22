import { Injectable } from '@angular/core';
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {Observable} from "rxjs";
import { environment } from '../environments/environment';
import {HandleError, HttpErrorHandler} from "./http-error-handler.service";
import {catchError} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";

export const authCodeFlowConfig: AuthConfig = {
  // URL of identity provider. https://<YOUR_DOMAIN>.auth0.com
  issuer: environment.issuer,
  redirectUri: window.location.origin,
  clientId: environment.clientId,
  responseType: 'code',
  scope: 'openid profile admin',
  showDebugInformation: true,
  silentRefreshRedirectUri: window.location.origin,
  useSilentRefresh: true,
  customQueryParams: {
    /**
     * replace with your API-Audience
     * This is very important to retrieve a valid access_token for our API
     * */
    audience: environment.audience,
  },
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private handleError: HandleError;

  constructor(
    private oauth: OAuthService,
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler

  ) {
    this.oauth.configure(authCodeFlowConfig);
    this.oauth.loadDiscoveryDocumentAndTryLogin();
    this.oauth.setupAutomaticSilentRefresh();

    this.handleError = httpErrorHandler.createHandleError('AuthService');
  }

  getAccessToken(): string {
    return this.oauth.getAccessToken();
  }

  loginWithRedirect(): void {
    this.oauth.logOut();
  }

  logout(url: { returnTo: string }): void {
    this.oauth.logOut(url);
  }

  isAuthenticated(): boolean {
    return this.oauth.hasValidAccessToken();
  }

  login(): void {
    this.oauth.initLoginFlow();
  }

  getUser(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Accept': 'application/json',
        Authorization: 'Bearer ' + this.oauth.getAccessToken()
      })
    };

    const url = `${environment.issuer}userinfo`;
    return this.http.get<any>(url, httpOptions).pipe(
      catchError(this.handleError<any>(`getUser`))
    );
  }
}
