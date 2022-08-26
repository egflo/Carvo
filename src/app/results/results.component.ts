import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ResultsService} from "./results.service";
import {Location} from '@angular/common';
import {PageEvent} from "@angular/material/paginator";
import {FormBuilder} from "@angular/forms";
import {MakeModel} from "../model/make-model";
import {Observable, of, Subject} from "rxjs";
import {BodyModel} from "../model/body-model";
import {FuelModel} from "../model/fuel-model";
import {ColorModel} from "../model/color-model";
import {DrivetrainModel} from "../model/drivetrain-model";
import {TransmissionModel} from "../model/transmission-model";
import {Page} from "../api/page";
import {ChangeContext, LabelType, Options, PointerType} from "@angular-slider/ngx-slider";
import {AuthService} from "../auth.service";
import {SearchModel} from "../model/search-model";
import {Direction} from "../model/direction";
import {Bookmark} from "../api/bookmark";
import {ModelModel} from "../model/model-model";
import {ModelTuple} from "../model/model-tuple";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {SnackbarService} from "../snackbar.service";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogComponent} from "../dialog/dialog.component";


@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent  {
  private url = new Subject<String>();
  private params = new Subject<URLSearchParams>();
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  //Initial parameters for search
  query: String[] = [];
  body_code: String[] = [];
  color_code: String[] = [];
  fuel_code: String[] = [];
  drivetrain_code: String[] = [];
  transmission_code: String[] = [];
  condition_code: String[] = [];


  //Pagination
  page: number = 1;
  limit: number = 10;
  sortDirection: Direction = Direction.ASC;
  numberOfElements: number = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //Filters
  startYears: any[] = [];
  endYears: any[] = [];
  defaultYear: String = "Any";
  startYear: String = this.defaultYear;
  endYear: String = this.defaultYear;


  makes$!: Observable<MakeModel[]>;
  makes: MakeModel[] = [];
  models: ModelTuple[] = [];
  types: BodyModel[] = [];
  fuels: FuelModel[] = [];
  colors: ColorModel[] = []
  drivetrains: DrivetrainModel[] = [];
  engines: TransmissionModel[] = [];
  transmissions: TransmissionModel[] = []
  cylinders: number[] = [4, 6, 8, 10, 12];
  priceMin: any;
  priceMax: any;
  postcode: number = 0;
  distance: number = 0;
  chips: SearchModel[] = [];
  bookmarks: Bookmark[] = [];
  defaultMileage: number = 250000;
  mileage: number = this.defaultMileage;
  optionsMiles: Options = {
    floor: 0,
    ceil: 400000,
  };
  value: number = 25000;
  highValue: number = 550000;
  options: Options = {
    floor: 100,
    ceil: 600000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "<b>Min price:</b> $" + value;
        case LabelType.High:
          return "<b>Max price:</b> $" + value;
        default:
          return "$" + value;
      }
  }};


  conditions: any[] = [
    {id:1, name: 'New', value: 'isNew'},
    {id: 2, name: 'Used', value: 'isUsed'},
    {id: 3, name: 'Manufacturer Certified', value: 'isOemcpo'},
    {id: 4, name: 'Third-Party Certified', value: 'isCpo'},
  ];


  sort: any = "id";
  direction: Direction = Direction.ASC;
  selectedSort: any;
  sortable: any = [
    {id: 0, name: 'Relevance'},
    {id: 1, name: 'Price Low to High'},
    {id: 2, name: 'Price High to Low'},
    {id: 3, name: 'Year Low to High'},
    {id: 4, name: 'Year High to Low'},
    {id: 5, name: 'Mileage Low to High'},
    {id: 6, name: 'Mileage High to Low'},
  ];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected resultsService: ResultsService,
    protected formBuilder: FormBuilder,
    protected auth: AuthService,
    protected snackBar: SnackbarService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const queryParams = this.route.snapshot.queryParamMap;

    //this.query = routeParams.get('id') || '';
    this.query = this.router.url.slice(9, this.router.url.length).split('?')[0].split('/').map(
      (item) => {
        return item.toLowerCase();
      }
    )
    this.page =  Number(queryParams.get('page')) || 1;
    this.limit = Number(queryParams.get('limit')) || 10;
    this.sortDirection = Number(queryParams.get('sortDirection')) || 1;

    this.body_code = this.processParamCode(queryParams.get('bodyCode') || undefined);
    this.color_code = this.processParamCode(queryParams.get('colorCode') || undefined);
    this.fuel_code = this.processParamCode(queryParams.get('fuelCode') || undefined);
    this.drivetrain_code = this.processParamCode(queryParams.get('drivetrainCode') || undefined);
    this.transmission_code = this.processParamCode(queryParams.get('transmissionCode') || undefined);
    this.mileage = Number(queryParams.get('mileage')) || this.defaultMileage;
    this.priceMin = Number(queryParams.get('priceMin')) || undefined;
    this.priceMax = Number(queryParams.get('priceMax')) || undefined;
    this.postcode = Number(queryParams.get('postcode')) || 0;
    this.distance = Number(queryParams.get('distance')) || 0;

    if (this.auth.isAuthenticated()) {
      this.resultsService.getBookmarks().subscribe(bookmarks => {
        this.bookmarks = bookmarks;
      });
    }

    this.buildYears();

    this.buildMakes();

    this.buildBodyTypes();

    this.buildFuels();

    this.buildColors();

    this.buildDrivetrains();

    this.buildTransmissions();

    this.buildPrices();

  }

  ngAfterViewInit(): void {
    this.fillChips();
  }

  search(term: String): void {

  }

  login(): void {
    this.auth.login();
  }

  processParamCode(param: any): String[] {
    let codes: string[] = [];
    if (param) {
      param.split("_").forEach((code: string) => {
        codes.push(code);
      });
    }
    return codes;
  }

  buildYears(): void {
    this.startYears = this.generateArrayYears(1989, new Date().getFullYear());
    this.endYears = this.generateArrayYears(1989, new Date().getFullYear()).reverse();
  }

  buildMakes() : void {
    this.resultsService.getMakes().subscribe(makes => {
      let options: MakeModel[] = [];
      makes = makes.sort((a, b) => { return a.name.localeCompare(b.name); });
      makes.forEach(make => {
        if (this.query.includes(make.name)) {
          this.buildModels(make.id, make.name);
        }
        options.push(
          { id: make.id, name: make.name, selected: this.query.includes(make.name.toLowerCase()) }
        );
      });
      this.makes = options;
      this.makes$ = of(options);
      this.fillChips()

    });

  }

  buildModels(makeId: Number, makeName: string): void {

    let get_models: ModelModel[] = [];

    this.resultsService.getModels(makeId).subscribe(models => {
      for (let model of models) {
        get_models.push(
          { id: model.id, make: model.make, name: model.name,  selected: false }
        );
      }

      //Tuple
      let tuple = { key: makeName, value: get_models } as ModelTuple;
      this.models.push(tuple);
    });
  }

  buildBodyTypes(): void {

    console.log(this.body_code);

    this.resultsService.getBodyTypes().subscribe(types => {
      for (let body of types) {
        this.types.push(
          { id: body.id, type: body.type, selected: this.query.includes(body.type.toLowerCase()) }
        );
      }
      this.fillChips()
    });
  }

  buildFuels() : void {
    this.resultsService.getFuelTypes().subscribe(fuels => {
      for (let fuel of fuels) {
        if(fuel.type.toLowerCase() !== "unknown") {
          this.fuels.push(
            { id: fuel.id, type: fuel.type, selected: this.fuel_code.includes(fuel.id.toString()) }
          );
        }
      }
    });
  }

  buildColors() : void {
    this.resultsService.getColors().subscribe(colors => {
      for (let color of colors) {
        this.colors.push(
          { id: color.id, name: color.name.toLowerCase(), selected: this.color_code.includes(color.id.toString()) }
        );
      }
    });
  }

  buildDrivetrains() : void {
    this.resultsService.getDrivetrain().subscribe(drivetrains => {
      for (let drivetrain of drivetrains) {
        if(drivetrain.name.toLowerCase() !== "n/a") {
          this.drivetrains.push(
            { id: drivetrain.id, name: drivetrain.name, description: drivetrain.description, selected: this.drivetrain_code.includes(drivetrain.id.toString()) }
          );
        }
      }
    });
  }

  buildTransmissions() {

    this.transmissions =
    [ { id: 1, type: 'A', description:'Automatic', selected: false },
      { id: 2, type: 'M', description:'Manual',selected: false },
      { id: 3, type: 'CVT',description:'CVT', selected: false }];
  }

  buildPrices() : void {
    if(this.priceMin && this.priceMax) {
      this.highValue = this.priceMax;
      this.value = this.priceMin;
    }

    else if(this.priceMin) {
      this.value = this.priceMin;
    }

    else if(this.priceMax) {
      this.highValue = this.priceMax;
    }
  }

  generateArrayYears(startYear: number, endYear: number) : any[] {
    let years = [ {id: 0, name: this.defaultYear, selected: true}];
    for (let i = startYear; i <= endYear; i++) {
      years.push( {id: i, name: String(i), selected: false} );
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

  onChangeSelect($event: any) {
    const selectElement = $event.target as HTMLSelectElement;
    const value = selectElement.value;


    if(selectElement.id.includes("start-year")) {

      if(this.endYear == this.defaultYear) {

        console.log("start year selected without end year");

        this.startYear = value;
        this.endYears = this.generateArrayYears(Number(value), new Date().getFullYear());
      }
      else {
        this.startYear = value;
        this.startYears.forEach(
          year => {
            year.selected = year.id == value ? true : false;
          }
        );
      }
    }

    else {
      if(this.startYear == this.defaultYear) {

        console.log("end year selected without start year");
        this.endYear = value;
        this.startYears = this.generateArrayYears(1989, Number(value))

      }
      else {
        this.endYear = value;
        this.endYears.forEach(
          year => {
            year.selected = year.id == value ? true : false;
          }
        );
      }
    }


    this.fillChips();

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);

  }

  onChangeMileage(changeContext: ChangeContext) {
    const value = changeContext.value;
    this.mileage = value;

    this.fillChips();

    const url = this.buildURL();
    const params = this.buildParams();
    this.search(`${url}?${params.toString()}`);
  }

  updateCheckList(array: any[], value: any) {
    let object = array.find(m => m.id === Number(value));
    object!.selected = !object!.selected;

    let selected = this.makes.filter(m => m.selected);

    return selected;
  }

  onChangeCheck($event: any) {
    const selectElement = $event.target as HTMLInputElement;
    const value = selectElement.value;
    const name  = selectElement.name;

    console.log(`${name} ${value}`);

    if(name.includes("model")) {
      let make_model = value.split("_");
      let make = make_model[0];
      let model = make_model[1];

      let find_make = this.models.find(m => m.key === make);
      let find_model = find_make!.value.find(m => m.id === Number(model));
      find_model!.selected = !find_model!.selected;
    }

    if(name === 'make') {
      let object = this.makes.find(m => m.id === Number(value));
      object!.selected = !object!.selected;

      let makeId = object!.id;
      this.buildModels(makeId, object!.name);
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

    if(name === 'condition') {
      let object = this.conditions.find(c => c.value === value);
      object!.selected = !object!.selected;
    }

    const url = this.buildURL();
    const params = this.buildParams();

    this.fillChips();
    this.search(`${url}?${params.toString()}`);

  }

  buildURL() : string {
    //Find selected makes
    let make_query = this.makes.filter(m => m.selected).map(m => m.name).join('/')
    let type_query = this.types.filter(t => t.selected).map(t => t.type).join('/');

    let query = "";

    if(make_query.length == 0 && type_query.length == 0) {
      query = 'all';
    }
    else if(make_query.length > 0 && type_query.length == 0) {
      query = make_query;
    }
    else if(make_query.length == 0 && type_query.length > 0) {
      query = type_query;
    }
    else {
      query = `${make_query}/${type_query}`;
    }
    return query;
  }

  buildParams(page: number = 1, limit: number = 10): URLSearchParams {
    let params: URLSearchParams = new URLSearchParams();
    let codes = '';

    let models_selected = []
    for(let model of this.models) {
      let selected = model.value.filter(m => m.selected);
      models_selected.push(...selected);
    }

    if(models_selected.length > 0) {
      codes +=  models_selected.map(m => m.id).join('_') ;
    }

    if(codes.length > 0) {
      params.set('modelCode', codes);
    }

    let selectedTypes = this.types.filter(t => t.selected);
    codes = '';
    for(let type of selectedTypes) {
      codes += type.id + "_";
    }

    if(selectedTypes.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('bodyCode', codes);
    }


    let selectedFuels = this.fuels.filter(f => f.selected);
    codes = '';
    for(let fuel of selectedFuels) {
      codes += fuel.id + "_";
    }

    if(selectedFuels.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('fuelCode', codes);
    }

    let selectedColors = this.colors.filter(c => c.selected);
    codes = '';
    for(let color of selectedColors) {
      codes += color.id + "_";
    }

    if(selectedColors.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('colorCode', codes);
    }

    let selectedDrivetrains = this.drivetrains.filter(d => d.selected);
    codes = '';
    for(let drivetrain of selectedDrivetrains) {
      codes += drivetrain.id + "_";
    }

    if(selectedDrivetrains.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('drivetrainCode', codes);
    }

    let selectedTransmissions = this.transmissions.filter(t => t.selected);
    codes = '';
    for(let transmission of selectedTransmissions) {
      codes += transmission.type + "_";
    }

    if(selectedTransmissions.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('transmissionCode', codes);
    };

    if(this.postcode !== 0) {
      params.append('postcode', this.postcode.toString());
    }

    if(this.distance !== 0) {
      params.append('distance', this.distance.toString());
    }

    let selectedConditions = this.conditions.filter(c => c.selected);
    codes = '';
    for(let condition of selectedConditions) {
      codes += condition.value + "_";
    }

    if(selectedConditions.length > 0) {
      codes = codes.substring(0, codes.length - 1);
      params.append('conditionCode', codes);
    }

    this.page = page;
    this.limit = limit;

    params.append('priceMin', this.value.toString());
    params.append('priceMax', this.highValue.toString());

    params.append('mileage', this.mileage.toString());

    if(this.startYear !== this.defaultYear) {
      params.append('startYear', this.startYear.toString());
    }
    if(this.endYear !== this.defaultYear) {
      params.append('endYear', this.endYear.toString());
    }

    params.append('page', this.page.toString());
    params.append('limit', this.limit.toString());

    params.append('sortBy', this.sort);
    params.append('sortDirection', this.direction.toString());
    return params;
  }

  onPostcodeChange($event: any) {

    const selectElement = $event.target as HTMLInputElement;
    this.postcode = Number(selectElement.value);

    const url = this.buildURL();
    const params = this.buildParams();

    this.fillChips();
    this.search(`${url}?${params.toString()}`);
  }

  onDistanceChange($event: any) {
    const selectElement = $event.target as HTMLInputElement;
    this.distance = Number(selectElement.value);

    const url = this.buildURL();
    const params = this.buildParams();

    this.fillChips();
    this.search(`${url}?${params.toString()}`);
  }

  onPriceChange(changeContext: ChangeContext) {
    const type = changeContext.pointerType == PointerType.Min ? 'min' : 'max';
    const value = changeContext.value;

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);

  }

  remove(item: SearchModel): void {

    console.log(item);

    if(item.type == 'postcode') {
      this.postcode = 0;
      this.distance = 0;
    }

    if(item.type == 'start_year') {
      this.startYear = this.defaultYear;
      this.startYears.map(y => y.selected = false);
    }

    if(item.type == 'end_year') {
      this.endYear = this.defaultYear;
      this.endYears.map(y => y.selected = false);
    }

    if(item.type == 'span_year') {
      this.startYear = this.defaultYear;
      this.endYear = this.defaultYear;

      this.startYears.map(y => y.selected = false);
      this.endYears.map(y => y.selected = false);
    }

    if(item.type === 'make') {
      let object = this.makes.find(m => m.id === item.id);
      object!.selected = !object!.selected;

      this.models = this.models.filter(m => m.key != item.label);

    }

    if(item.type === 'model') {
      for (let model of this.models) {
        let object = model.value.find(m => m.id === item.id);
        object!.selected = !object!.selected;
      }
    }

    if(item.type === 'body') {
      let object = this.types.find(t => t.id === item.id);
      object!.selected = !object!.selected;
    }
    if(item.type === 'fuel') {
      let object = this.fuels.find(f => f.id === item.id);
      object!.selected = !object!.selected;
    }

    if(item.type === 'color') {
      let object = this.colors.find(c => c.id === item.id);
      object!.selected = !object!.selected;
    }

    if(item.type === 'drivetrain') {
      let object = this.drivetrains.find(d => d.id === item.id);
      object!.selected = !object!.selected;
    }

    if(item.type === 'transmission') {
      let object = this.transmissions.find(t => t.id === item.id);
      object!.selected = !object!.selected;
    }

    if(item.type === 'condition') {
      let object = this.conditions.find(c => c.id === item.id);
      object!.selected = !object!.selected;
    }

    if(item.type === 'mileage') {
      this.mileage = this.defaultMileage;
    }

    this.fillChips();
  }

  fillChips() {
    this.chips = [];

    let makes = this.makes.filter(m => m.selected);

    let types = this.types.filter(t => t.selected);
    let fuels = this.fuels.filter(f => f.selected);
    let colors = this.colors.filter(c => c.selected);
    let drivetrains = this.drivetrains.filter(d => d.selected);
    let transmissions = this.transmissions.filter(t => t.selected);
    let conditions = this.conditions.filter(c => c.selected);

    for (let make of makes) {
      this.chips.push(
        {
          id: make.id,
          label: make.name,
          type: 'make',
          selected: true
        }
      );
    }

    for (let model of this.models) {
      let selected = model.value.filter(m => m.selected);
      for (let m of selected) {
        this.chips.push(
          {
            id: m.id,
            label: m.name,
            type: 'model',
            selected: true
          }
        );
      }
    }

    for (let type of types) {
      this.chips.push(
        {
          id: type.id,
          label: type.type,
          type: 'body',
          selected: true
        }
      );
    }

    for (let fuel of fuels) {
      this.chips.push(
        {
          id: fuel.id,
          label: fuel.type,
          type: 'fuel',
          selected: true
        }
      );
    }

    for (let color of colors) {
      this.chips.push(
        {
          id: color.id,
          label: color.name,
          type: 'color',
          selected: true
        }
      );
    }

    for (let drivetrain of drivetrains) {
      this.chips.push(
        {
          id: drivetrain.id,
          label: drivetrain.name,
          type: 'drivetrain',
          selected: true
        }
      );
    }

    for (let transmission of transmissions) {
      this.chips.push(
        {
          id: transmission.id,
          label: transmission.description,
          type: 'transmission',
          selected: true
        }
      );
    }

    for (let condition of conditions) {
      this.chips.push(
        {
          id: condition.id,
          label: condition.name,
          type: 'condition',
          selected: true
        }
      );
    }

    if(this.mileage !== this.defaultMileage) {
      this.chips.push(
        {
          id: this.mileage,
          label: ` less than ${this.mileage} miles`,
          type: 'mileage',
          selected: true
        }
      );
    }

    if(this.postcode  !== 0 && this.distance === 0) {
      this.chips.push(
        {
          id: this.postcode,
          label: `${this.postcode}`,
          type: 'postcode',
          selected: true
        }
      );
    }

    if(this.postcode  !== 0 && this.distance !== 0) {
      this.chips.push(
        {
          id: this.postcode,
          label: `within ${this.distance} miles of ${this.postcode}`,
          type: 'postcode',
          selected: true
        }
      );
    }

    if(this.startYear !== this.defaultYear && this.endYear !== this.defaultYear) {
      this.chips.push(
        {
          id: 0,
          label: this.startYear + ' - ' + this.endYear,
          type: 'span_year',
          selected: true
        }
      );
    }
    else if(this.startYear !== this.defaultYear) {
      this.chips.push(
        {
          id: 0,
          label: 'Min ' + this.startYear.toString(),
          type: 'start_year',
          selected: true
        }
      );
    }
    else if(this.endYear !== this.defaultYear) {
      this.chips.push(
        {
          id: 0,
          label: 'Max ' + this.endYear.toString(),
          type: 'end_year',
          selected: true
        }
      );
    }

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);
  }

  clearChips() {
    this.chips = [];
    this.makes.forEach(m => m.selected = false);
    this.types.forEach(t => t.selected = false);
    this.fuels.forEach(f => f.selected = false);
    this.colors.forEach(c => c.selected = false);
    this.drivetrains.forEach(d => d.selected = false);
    this.transmissions.forEach(t => t.selected = false);
    this.conditions.forEach(c => c.selected = false);
    this.mileage = this.defaultMileage;
    this.startYear = this.defaultYear;
    this.endYear = this.defaultYear;

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);
  }

  onSortChange() {

    switch (this.selectedSort) {
      case 0:
        this.sort = 'id';
        this.direction = Direction.ASC;
        break;
      case 1:
        this.sort = 'price';
        this.direction = Direction.ASC;
        break;
      case 2:
        this.sort = 'price';
        this.direction = Direction.DESC;
        break;
      case 3:
        this.sort = 'year';
        this.direction = Direction.ASC;
        break;
      case 4:
        this.sort = 'year';
        this.direction = Direction.DESC;
        break;
      case 5:
        this.sort = 'mileage';
        this.direction = Direction.ASC;
        break;
      case 6:
        this.sort = 'mileage';
        this.direction = Direction.DESC;
        break;
      case 7:
        this.sort = 'created';
        this.direction = Direction.ASC;
        break;
      default:
        this.sort = 'id';
        this.direction = Direction.ASC;
        break;

    }

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);
  }

  isBookmarked(id: number): boolean {
    return this.bookmarks.some(b => b.autoId === id);
  }

  openDialog(): void {
    if(!this.auth.isAuthenticated()) {
      this.snackBar.openSnackBar('You must be logged in to save searches');
    }
    else {
      const url = this.buildURL();
      const params = this.buildParams();

      const dialogRef = this.dialog.open(DialogComponent, {
        width: '250px',
        data: {
          query: `${url}?${params.toString()}`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.snackBar.openSnackBar('Search saved');
        }
        else {
          this.snackBar.openSnackBar('Search not saved');
        }
      });
    }

  }
}
