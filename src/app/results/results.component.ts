import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ResultsService} from "./results.service";
import {Location} from '@angular/common';
import {Auto} from "../api/auto";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  // MatPaginator Inputs
  page: number = 1;
  limit: number = 10;
  numberOfElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  results: Auto[] = [];

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private resultsService: ResultsService
  ) {}

  ngOnInit(): void {
    console.log("ResultsComponent.ngOnInit");

    this.route.queryParams.subscribe(params => {
      this.page = params['page'] || 1;
      this.limit = params['limit'] || 10;

      this.resultsService.getResults(this.page, this.limit).subscribe(results => {
        console.log(results);
        this.page = results.number;
        this.limit = results.size;
        this.numberOfElements = results.totalElements;
        this.results = results.content
      }
      );}
    );
  }

  onPageChange($event: PageEvent) {
    console.log("ResultsComponent.onPageChange");
    console.log($event);
    //this.router.navigate(['/results'], {queryParams: {page: $event.pageIndex + 1, limit: $event.pageSize}});
    this.resultsService.getResults($event.pageIndex + 1, $event.pageSize).subscribe(results => {
      console.log(results);
      this.page = results.number;
      this.limit = results.size;
      this.numberOfElements = results.totalElements;
      this.results = results.content
    } );
  }
}
