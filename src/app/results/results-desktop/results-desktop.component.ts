import { Component, OnInit } from '@angular/core';
import {ResultsComponent} from "../results.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ResultsService} from "../results.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {Observable} from "rxjs";
import {Page} from "../../api/page";

@Component({
  selector: 'app-results-desktop',
  templateUrl: './results-desktop.component.html',
  styleUrls: ['./results-desktop.component.css']
})
export class ResultsDesktopComponent extends ResultsComponent implements OnInit {
  results$!: Observable<Page>

  constructor(
     route: ActivatedRoute,
     router: Router,
     location: Location,
     resultsService: ResultsService,
     formBuilder: FormBuilder,
     auth: AuthService
  ) {
    super(route, router, location, resultsService, formBuilder, auth);
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const queryParams = this.route.snapshot.queryParamMap;

    this.query = routeParams.get('id') || '';
    this.page =  Number(queryParams.get('page')) || 1;
    this.limit = Number(queryParams.get('limit')) || 10;


    // this.results$ = this.url.pipe(
    //ignore new values if they are the same as the last value
    //  distinctUntilChanged(),

    //switch to new value
    // switchMap((url: String) => {
    //   return this.resultsService.getResults(url);
    //  })
    //);


    if (this.auth.isAuthenticated()) {
      this.resultsService.getBookmarks().subscribe(bookmarks => {
        this.bookmarks = bookmarks;
      });
    }


    this.route.queryParams.subscribe(params => {
      this.page = params['page'] || 1;
      this.limit = params['limit'] || 10;//get results for new value
    });


    this.buildYears();

    this.buildMakes();

    this.buildBodyTypes();

    this.buildFuels();

    this.buildColors();

    this.buildDrivetrains();

    this.buildTransmissions();

    let params = this.buildParams()
    this.results$ = this.resultsService.getResults(this.query + "?" + params.toString());

  }

  override search(term: String): void {
    console.log("Searching for: " + term);
    //Set observable to none to load new results
    //this.url.next(term);

    this.results$ = this.resultsService.getResults(term);
  }
}
