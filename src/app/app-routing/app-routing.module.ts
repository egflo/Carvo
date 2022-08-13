import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule, Routes} from "@angular/router";
import {AutoComponent} from "../auto/auto.component";
import {HomeComponent} from "../home/home.component";
import {ResultsComponent} from "../results/results.component";
import {UserProfileComponent} from "../user-profile/user-profile.component";
import {FavoriteComponent} from "../favorite/favorite.component";
import {ViewStateService} from "../view-state.service";
import {ResultsMobileComponent} from "../results/results-mobile/results-mobile.component";
import {AutoDesktopComponent} from "../auto/auto-desktop/auto-desktop.component";
import {AutoMobileComponent} from "../auto/auto-mobile/auto-mobile.component";
import {ResultsDesktopComponent} from "../results/results-desktop/results-desktop.component";

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auto/:id', component: AutoDesktopComponent, pathMatch: 'full' },
  { path: 'results', children: [
    { path: '', component: ResultsDesktopComponent },
    { path: '**', component: ResultsDesktopComponent },
  ] },
  { path:'user', component: UserProfileComponent },
  { path: 'favorites', component: FavoriteComponent },
];

const mobileRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'auto/:id', component: AutoMobileComponent, pathMatch: 'full' },
  { path: 'results/**', component: ResultsMobileComponent },
  { path: 'results', component: ResultsMobileComponent },
  { path:'user', component: UserProfileComponent },
  { path: 'favorites', component: FavoriteComponent },
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
  constructor(
    private router: Router,
    private viewStateService: ViewStateService
  ) {
    if(this.viewStateService.getIsMobile()) {
      this.router.resetConfig(mobileRoutes);
    }
  }

}
