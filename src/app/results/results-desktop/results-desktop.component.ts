import { Component, OnInit } from '@angular/core';
import {ResultsComponent} from "../results.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ResultsService} from "../results.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {Observable} from "rxjs";
import {Page} from "../../api/page";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarService} from "../../snackbar.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-results-desktop',
  templateUrl: './results-desktop.component.html',
  styleUrls: ['./results-desktop.component.css']
})
export class ResultsDesktopComponent extends ResultsComponent  {
  results$!: Observable<Page>

  constructor(
     route: ActivatedRoute,
     router: Router,
     location: Location,
     resultsService: ResultsService,
     formBuilder: FormBuilder,
     auth: AuthService,
     snackBar: SnackbarService,
     dialog: MatDialog
  ) {
    super(route, router, location, resultsService, formBuilder, auth, snackBar,dialog);
  }


  override ngAfterViewInit() {
    let params = this.buildParams()
    this.results$ = this.resultsService.getResults(this.query.join('/')+ "?" + params.toString());
  }

  override search(term: String): void {
    //console.log("Searching for: " + term);
    //Set observable to none to load new results
    //this.url.next(term);

    window.history.pushState({}, '', '/results/' + term);
    this.results$ = this.resultsService.getResults(term);
  }

}
