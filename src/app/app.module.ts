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


@NgModule({
  declarations: [
    AppComponent,
    AutoComponent,
    HomeComponent
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
    StarRatingModule.forRoot()
  ],
  providers: [
    HttpErrorHandler,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
