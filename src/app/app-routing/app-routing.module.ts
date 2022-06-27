import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AutoComponent} from "../auto/auto.component";
import {HomeComponent} from "../home/home.component";
import {ResultsComponent} from "../results/results.component";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auto/:id', component: AutoComponent, pathMatch: 'full' },
  { path: 'results/:id', component: ResultsComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
