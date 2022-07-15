import { Injectable } from '@angular/core';
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";
import {Observable} from "rxjs";
import { environment } from '../environments/environment';

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

  constructor(private oauth: OAuthService) {
    this.oauth.configure(authCodeFlowConfig);
    this.oauth.loadDiscoveryDocumentAndTryLogin();
    this.oauth.setupAutomaticSilentRefresh();
    console.log("Constructor AuthService");
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

}
