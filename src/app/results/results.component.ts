import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ResultsService} from "./results.service";
import {Location} from '@angular/common';
import {Auto} from "../api/auto";
import {PageEvent} from "@angular/material/paginator";
import {Make} from "../api/make";
import {BodyType} from "../api/body-type";
import {Fuel} from "../api/fuel";
import {Color} from "../api/color";
import {Drivetrain} from "../api/drivetrain";
import {Engine} from "../api/engine";
import {Transmission} from "../api/transmission";
import {FormBuilder} from "@angular/forms";
import {MakeModel} from "../model/make-model";
import {distinctUntilChanged, Observable, Subject} from "rxjs";
import {BodyModel} from "../model/body-model";
import {FuelModel} from "../model/fuel-model";
import {ColorModel} from "../model/color-model";
import {DrivetrainModel} from "../model/drivetrain-model";
import {TransmissionModel} from "../model/transmission-model";
import {switchMap} from "rxjs/operators";
import {Page} from "../api/page";
import {query} from "@angular/animations";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  query!: String;

  results$!: Observable<Page>
  private url = new Subject<String>();
  private params = new Subject<URLSearchParams>();

  //Pagination
  page: number = 1;
  limit: number = 10;
  numberOfElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //Filters
  startYears: number[] = [];
  endYears: number[] = [];

  startYear: number = 1950;
  endYear: number = new Date().getFullYear();
  makes: MakeModel[] = [];
  types: BodyModel[] = [];
  fuels: FuelModel[] = [];
  colors: ColorModel[] = []
  drivetrains: DrivetrainModel[] = [];
  engines: TransmissionModel[] = [];
  transmissions: TransmissionModel[] = []
  cylinders: number[] = [ 4,  6, 8, 10, 12];
  mileage: number = 400000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private resultsService: ResultsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const queryParams = this.route.snapshot.queryParamMap;

    this.query = routeParams.get('id') || 'T';
    this.page =  Number(queryParams.get('page')) || 1;
    this.limit = Number(queryParams.get('limit')) || 10;


    //this.results$ = this.resultsService.getResults(this.query, this.page, this.limit);

    this.results$ = this.url.pipe(
      //ignore new values if they are the same as the last value
      distinctUntilChanged(),

      //switch to new value
      switchMap((url: String) => {
        return this.resultsService.getResults(url);
      })
    );

    this.route.queryParams.subscribe(params => {
      this.page = params['page'] || 1;
      this.limit = params['limit'] || 10;//get results for new value
    });

    this.startYears = this.generateArrayYears(1950, new Date().getFullYear());
    this.endYears = this.generateArrayYears(1950, new Date().getFullYear()).reverse();

    this.buildMakes();

    this.buildBodyTypes();

    this.buildFuels();

    this.buildColors();

    this.buildDrivetrains();

    this.buildTransmissions();
  }

  search(term: String): void {
    console.log("Searching for: " + term);
    //Set observable to none to load new results
    this.url.next(term);
  }

  buildMakes() : void {
    this.resultsService.getMakes().subscribe(makes => {
      for (let make of makes) {
        if(make.name.toLowerCase() !== "unknown") {
          this.makes.push(
            { id: make.id, name: make.name, selected: this.query.toLowerCase() === make.name.toLowerCase() }
          );
        }
      } });
  }

  buildBodyTypes(): void {
    this.resultsService.getBodyTypes().subscribe(types => {
      for (let body of types) {
        this.types.push(
          { id: body.id, type: body.type, selected: false }
        );
      }
    });
  }

  buildFuels() {
    this.resultsService.getFuelTypes().subscribe(fuels => {
      for (let fuel of fuels) {
        if(fuel.type.toLowerCase() !== "unknown") {
          this.fuels.push(
            { id: fuel.id, type: fuel.type, selected: false }
          );
        }
      }
    });
  }

  buildColors() {
    this.resultsService.getColors().subscribe(colors => {
      for (let color of colors) {
        this.colors.push(
          { id: color.id, name: color.name, selected: false }
        );
      }
    });
  }

  buildDrivetrains() {
    this.resultsService.getDrivetrain().subscribe(drivetrains => {
      for (let drivetrain of drivetrains) {
        if(drivetrain.name.toLowerCase() !== "unknown") {
          this.drivetrains.push(
            { id: drivetrain.id, name: drivetrain.name, description: drivetrain.description, selected: false }
          );
        }
      }
    });
  }

  buildTransmissions() {this.transmissions =
    [ { id: 1, type: 'A', description:'Automatic', selected: false },
      { id: 2, type: 'M', description:'Manual',selected: false },
      { id: 3, type: 'CVT',description:'CVT', selected: false }];
  }

  generateArrayYears(startYear: number, endYear: number) {
    let years = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years;
  }

  onPageChange($event: PageEvent) {
    console.log("ResultsComponent.onPageChange");
    console.log($event);

    let page = $event.pageIndex + 1;
    let limit = $event.pageSize;

    const query = this.buildURL()
    const params = this.buildParams(page, limit);

    this.search(`${query}?${params.toString()}`);
    //this.router.navigate(['/results'], {queryParams: {page: $event.pageIndex + 1, limit: $event.pageSize}});
  }

  onChangeSelect($event: Event) {
    const selectElement = $event.target as HTMLSelectElement;
    const value = selectElement.value;

    //if id is start year
    if(selectElement.id.includes("start-year")) {

      this.startYear = Number(value);

      //this.startYears = this.generateArrayYears(Number(value), new Date().getFullYear());
      //let start = this.startYears[0];
      //this.endYears = this.generateArrayYears(start, new Date().getFullYear()).reverse();
    }
    //if id is end year
    if(selectElement.id.includes("end-year")) {

      this.endYear = Number(value);

      let start = this.startYears[0];
      let end = Number(value);
      this.endYears = this.generateArrayYears(start, end).reverse();
    }

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);

  }

  onChangeMileage($event: Event) {
    const selectElement = $event.target as HTMLInputElement;
    this.mileage = Number(selectElement.value);
  }

  updateCheckList(array: any[], value: any) {
    let object = array.find(m => m.id === Number(value));
    object!.selected = !object!.selected;

    let selected = this.makes.filter(m => m.selected);

    return selected;
  }

  onChangeCheck($event: Event) {
    const selectElement = $event.target as HTMLInputElement;
    const value = selectElement.value;
    const name  = selectElement.name;

    if(name === 'make') {
      let object = this.makes.find(m => m.id === Number(value));
      object!.selected = !object!.selected;
    }
    if(name === 'body') {
      let object = this.types.find(t => t.id === Number(value));
      object!.selected = !object!.selected;
    }

    if(name === 'fuel') {
      let object = this.fuels.find(f => f.id === Number(value));
      object!.selected = !object!.selected;
    }
    if(name === 'color') {
      let object = this.colors.find(c => c.id === Number(value));
      object!.selected = !object!.selected;
    }
    if(name === 'drivetrain') {
      let object = this.drivetrains.find(d => d.id === Number(value));
      object!.selected = !object!.selected;
    }
    if(name === 'transmission') {
      let object = this.transmissions.find(t => t.type === value);
      object!.selected = !object!.selected;
    }

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);

  }

  buildURL() {
    //Find selected makes
    let query = this.makes.filter(m => m.selected).map(m => m.name).join('/');
    return query;
  }

  buildParams(page: number = 1, limit: number = 10) {
    let params: URLSearchParams = new URLSearchParams();

    let selectedTypes = this.types.filter(t => t.selected);
    let codes = '';
    for(let type of selectedTypes) {
      codes += type.id + "_";
    }

    if(selectedTypes.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('body_code', codes);
    }


    let selectedFuels = this.fuels.filter(f => f.selected);
    codes = '';
    for(let fuel of selectedFuels) {
      codes += fuel.id + "_";
    }

    if(selectedFuels.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('fuel_code', codes);
    }


    let selectedColors = this.colors.filter(c => c.selected);
    codes = '';
    for(let color of selectedColors) {
      codes += color.id + "_";
    }

    if(selectedColors.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('color_code', codes);
    }

    let selectedDrivetrains = this.drivetrains.filter(d => d.selected);
    codes = '';
    for(let drivetrain of selectedDrivetrains) {
      codes += drivetrain.id + "_";
    }

    if(selectedDrivetrains.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('drivetrain_code', codes);
    }

    let selectedTransmissions = this.transmissions.filter(t => t.selected);
    codes = '';
    for(let transmission of selectedTransmissions) {
      codes += transmission.type + "_";
    }

    if(selectedTransmissions.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('transmission_code', codes);
    };

    this.page = page;
    this.limit = limit;

    params.append('start_year', this.startYear.toString());
    params.append('end_year',  this.endYear.toString());
    params.append('page', this.page.toString());
    params.append('limit', this.limit.toString());

    return params;
  }
}
