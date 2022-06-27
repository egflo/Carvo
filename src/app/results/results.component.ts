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
    this.endYears = this.generateArrayYears(1950, new Date().getFullYear());

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

  formatMiles(value: number) {
    let formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(value);
  }

  formatCurrency(value: number) {
    // Create our number formatter.
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(value);
  }

  onPageChange($event: PageEvent) {
    console.log("ResultsComponent.onPageChange");
    console.log($event);
    //this.router.navigate(['/results'], {queryParams: {page: $event.pageIndex + 1, limit: $event.pageSize}});
  }

  onClick(id: number) {
    this.router.navigate(['/auto', id]).then(r =>  {}).catch(e => console.log(e));

  }

  getImage(auto: Auto) {
    let image = auto.images[0];
    if (image) {
      return 'https://cars.usnews.com/pics/size/776x517/images/Auto/izmo/i5006/2015_bmw_7_series_angularfront.jpg';
      //return image.url.trim();
    }
    return '/assets/images/fallback.png'
  }

  onChangeSelect($event: Event) {
    const selectElement = $event.target as HTMLSelectElement;
    const value = selectElement.value;

    //change end year to not show years before start year
    this.endYears = this.generateArrayYears(Number(value), new Date().getFullYear());
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
    console.log(value, name);


    let query: String = "";
    let params: URLSearchParams = new URLSearchParams();

    if(name === 'make') {
      let object = this.makes.find(m => m.id === Number(value));
      object!.selected = !object!.selected;

      //Find selected makes
      let selectedMakes = this.makes.filter(m => m.selected);

      for (let make of selectedMakes) {
        //if last make, don't add comma
        if(make.id === selectedMakes[selectedMakes.length - 1].id) {
          query += make.name;
        }
        else {
          query += make.name + "/";
        }
      }
    }
    if(name === 'body') {
      let object = this.types.find(t => t.id === Number(value));
      object!.selected = !object!.selected;
      let selectedTypes = this.types.filter(t => t.selected);

      let codes = '';
      for(let type of selectedTypes) {
        codes += type.id + "_";
      }

      codes = codes.substring(0, codes.length - 1);
      params.append('body_code', codes);
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

    this.page = 1;
    params.set('page', this.page.toString());
    params.set('limit', this.limit.toString());

    this.search(`${query}?${params.toString()}`);

  }
}
