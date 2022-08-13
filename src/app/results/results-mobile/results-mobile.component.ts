import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, Scroll} from "@angular/router";
import {Location} from "@angular/common";
import {ResultsService} from "../results.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../auth.service";
import {PageEvent} from "@angular/material/paginator";
import {Auto} from "../../api/auto";
import {MatDrawerContainer, MatSidenavContainer} from "@angular/material/sidenav";
import {ResultsComponent} from "../results.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackbarService} from "../../snackbar.service";

@Component({
  selector: 'app-results-mobile',
  templateUrl: './results-mobile.component.html',
  styleUrls: ['./results-mobile.component.css']
})
export class ResultsMobileComponent extends ResultsComponent implements OnInit {

  last: Boolean = false;
  array = [] as Auto[];
  show: Boolean = true;
  throttle = 150;
  scrollDistance = 2;
  scrollUpDistance = 1.5;
  loading: boolean = true;


  public filterOpen: boolean = false;
  public sortOpen: boolean = false;
  public currentScrollPosition: number = 0;
  selector: string = ".mobile-container";


  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location,
    resultsService: ResultsService,
    formBuilder: FormBuilder,
    auth: AuthService,
    snackBar: SnackbarService
  ) {
    super(route, router, location, resultsService, formBuilder, auth, snackBar);
  }

  override ngAfterViewInit() {
    let params = this.buildParams()
    this.resultsService.getResults(this.query + "?" + params.toString()).subscribe(results => {
      this.array = results.content;
      this.numberOfElements = results.totalElements;
      this.last = results.last;
      this.loading = false;
      console.log(this.loading);
    } , error => {
      console.log(error);
    });
  }

  override search(term: String, scrollable: boolean = false): void {
    this.loading = true;
    if(!scrollable) {
      this.page = 1;
      this.array = [];
    }

    this.resultsService.getResults(term).subscribe(results => {
      if(!scrollable) {
        this.array = results.content;
      }
      else {
        this.array = this.array.concat(results.content);
      }
      this.numberOfElements = results.totalElements;
      this.last = results.last;
      this.loading = false;
    } , error => {
      console.log(error);
    } );
  }


  onScrollDown() {
    const scrollY = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.body.clientHeight;
    const scrollPosition = scrollY + clientHeight;

    //if we are already at the end of the list, don't do anything
    //if loading is true, don't do anything
    if( !this.last  || !this.loading) {
      this.page++;
      const url = this.buildURL();
      const params = this.buildParams();
      this.search(`${url}?${params.toString()}`, true);
    }

  }

  toggleFilter() {
    if(this.sortOpen) {
      this.sortOpen = false;
    }
    this.filterOpen = !this.filterOpen;
  }

  toggleSort() {
    if(this.filterOpen) {
      this.filterOpen = false;
    }
    this.sortOpen = !this.sortOpen;
  }

}
