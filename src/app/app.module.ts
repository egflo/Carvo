import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AutoComponent } from './auto/auto.component';
import { HttpClientModule } from '@angular/common/http';
import {HttpErrorHandler} from "./http-error-handler.service";
import {MessageService} from "./message.service";
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // CLI imports AppRoutingModule
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from "@angular/material/tabs";
import {GoogleMapsModule} from "@angular/google-maps";
import {StarRatingModule} from "angular-star-rating";
import { HomeComponent } from './home/home.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { ResultsComponent } from './results/results.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {CdkAccordionModule} from "@angular/cdk/accordion";
import {GalleryModule} from "ng-gallery";
import { AutoCardComponent } from './auto-card/auto-card.component';
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Event} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {AuthModule} from "@auth0/auth0-angular";
import { AuthButtonComponent } from './auth-button/auth-button.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {AuthService} from "./auth.service";
import {OAuthModule} from "angular-oauth2-oidc";



import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import {MatButtonModule} from "@angular/material/button";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import { WatchlistComponent } from './watchlist/watchlist.component';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import { FavoriteComponent } from './favorite/favorite.component';
import {ViewStateService} from "./view-state.service";
import { ResultsMobileComponent } from './results-mobile/results-mobile.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatRadioModule} from "@angular/material/radio";
import { AutoMobileComponent } from './auto/auto-mobile/auto-mobile.component';
import { AutoDesktopComponent } from './auto/auto-desktop/auto-desktop.component';

@NgModule({
  declarations: [
    AppComponent,
    AutoComponent,
    HomeComponent,
    ResultsComponent,
    AutoCardComponent,
    AuthButtonComponent,
    UserProfileComponent,
    WatchlistComponent,
    FavoriteComponent,
    ResultsMobileComponent,
    AutoMobileComponent,
    AutoDesktopComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatChipsModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    GoogleMapsModule,
    StarRatingModule.forRoot(),
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    CdkAccordionModule,
    GalleryModule,
    FormsModule,
    NgxSliderModule,
    MatInputModule,
    InfiniteScrollModule,
    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-ncqu2zod.us.auth0.com',
      clientId: 'EHic8gWWdFvWRvmdnW6wlslUrG86Dp33',
      httpInterceptor: {
        allowedList: ['https://dev-ncqu2zod.us.auth0.com/api/v2/'],
      },
    }),
    OAuthModule.forRoot(),
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatRadioModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    HttpErrorHandler,
    MessageService,
    AuthService,
    ViewStateService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
