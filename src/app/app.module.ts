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
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { ResultsComponent } from './results/results.component';
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [
    AppComponent,
    AutoComponent,
    HomeComponent,
    ResultsComponent
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
    MatPaginatorModule
  ],
  providers: [
    HttpErrorHandler,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
