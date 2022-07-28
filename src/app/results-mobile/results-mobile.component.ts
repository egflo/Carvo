import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Page} from "../api/page";
import {MakeModel} from "../model/make-model";
import {BodyModel} from "../model/body-model";
import {FuelModel} from "../model/fuel-model";
import {ColorModel} from "../model/color-model";
import {DrivetrainModel} from "../model/drivetrain-model";
import {TransmissionModel} from "../model/transmission-model";
import {ChangeContext, LabelType, Options, PointerType} from "@angular-slider/ngx-slider";
import {SearchModel} from "../model/search-model";
import {Direction} from "../model/direction";
import {Bookmark} from "../api/bookmark";
import {ActivatedRoute, Router, Scroll} from "@angular/router";
import {Location} from "@angular/common";
import {ResultsService} from "../results/results.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../auth.service";
import {PageEvent} from "@angular/material/paginator";
import {Auto} from "../api/auto";
import {MatDrawerContainer, MatSidenavContainer} from "@angular/material/sidenav";

@Component({
  selector: 'app-results-mobile',
  templateUrl: './results-mobile.component.html',
  styleUrls: ['./results-mobile.component.css']
})
export class ResultsMobileComponent implements OnInit {

  bottomScroll: boolean = false;

  query!: String;

  results$!: Observable<Page>
  private url = new Subject<String>();
  private params = new Subject<URLSearchParams>();

  //Pagination
  page: number = 1;
  limit: number = 10;
  numberOfElements: number = 0;
  last: Boolean = false;
  array = [] as Auto[];
  show: Boolean = true;
  throttle = 150;
  scrollDistance = 1;
  scrollUpDistance = 1.5;
  loading: Boolean = true;


  //Filters
  startYears: any[] = [];
  endYears: any[] = [];
  defaultYear: String = "Any";
  startYear: String = this.defaultYear;
  endYear: String = this.defaultYear;


  makes: MakeModel[] = [];
  types: BodyModel[] = [];
  fuels: FuelModel[] = [];
  colors: ColorModel[] = []
  drivetrains: DrivetrainModel[] = [];
  engines: TransmissionModel[] = [];
  transmissions: TransmissionModel[] = []
  cylinders: number[] = [ 4,  6, 8, 10, 12];
  priceMin: any;
  priceMax: any;
  postcode: number = 0;
  distance: number = 0;

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
  chips: SearchModel[] = [];

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

  bookmarks: Bookmark[] = [];
  sorts: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private resultsService: ResultsService,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {}


  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const queryParams = this.route.snapshot.queryParamMap;

    this.query = routeParams.get('id') || '';
    this.page =  Number(queryParams.get('page')) || 1;
    this.limit = Number(queryParams.get('limit')) || 10;



    let params = this.buildParams()
    this.resultsService.getResults(this.query + "?" + params.toString()).subscribe(results => {
      this.array = results.content;
      this.numberOfElements = results.totalElements;
      this.last = results.last;
      this.loading = false;
    } , error => {
      console.log(error);
    });

    this.resultsService.getBookmarks().subscribe(bookmarks => {
      this.bookmarks = bookmarks;
    });

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
  }


  search(term: String): void {
    this.loading = true;
    this.array = [];

    this.resultsService.getResults(term).subscribe(results => {
      this.array = results.content;
      this.numberOfElements = results.totalElements;
      this.last = results.last;
      this.loading = false;
    } , error => {
      console.log(error);
    } );
  }

  buildYears(): void {
    this.startYears = this.generateArrayYears(1989, new Date().getFullYear());
    this.endYears = this.generateArrayYears(1989, new Date().getFullYear()).reverse();
  }

  buildMakes() : void {
    this.resultsService.getMakes().subscribe(makes => {
      for (let make of makes) {
        if(make.name.toLowerCase() !== "unknown") {
          this.makes.push(
            { id: make.id, name: make.name, selected: this.query.toLowerCase() === make.name.toLowerCase() }
          );
        }
      }
      this.fillChiplist()
    });
  }

  buildBodyTypes(): void {
    this.resultsService.getBodyTypes().subscribe(types => {
      for (let body of types) {
        this.types.push(
          { id: body.id, type: body.type, selected: this.query.toLowerCase() === body.type.toLowerCase() }
        );
      }

      this.fillChiplist()
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
          { id: color.id, name: color.name.toLowerCase(), selected: false }
        );
      }
    });
  }

  buildDrivetrains() {
    this.resultsService.getDrivetrain().subscribe(drivetrains => {
      for (let drivetrain of drivetrains) {
        if(drivetrain.name.toLowerCase() !== "n/a") {
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
    let years = [this.defaultYear];
    for (let i = startYear; i <= endYear; i++) {
      years.push(String(i));
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


    //if id is start year
    if(selectElement.id.includes("start-year")) {
      this.startYear = value;
    }
    //if id is end year
    if(selectElement.id.includes("end-year")) {
      this.endYear = value;


      let start = this.startYear
      let end = this.endYear

      if(start != this.defaultYear && end != this.defaultYear) {
        this.endYears = this.generateArrayYears(Number(start), Number(end));
      }

      else if (start == this.defaultYear) {
        this.endYears = this.generateArrayYears(Number(start), Number(end));
      }


    }

    this.fillChiplist();

    const url = this.buildURL();
    const params = this.buildParams();

    this.search(`${url}?${params.toString()}`);

  }

  onChangeMileage(changeContext: ChangeContext) {
    const value = changeContext.value;
    this.mileage = value;

    this.fillChiplist();

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

    if(name === 'condition') {
      let object = this.conditions.find(c => c.value === value);
      object!.selected = !object!.selected;
    }

    const url = this.buildURL();
    const params = this.buildParams();

    this.fillChiplist();
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
      params.append('condition_code', codes);
    }

    this.page = page;
    this.limit = limit;

    params.append('price_min', this.value.toString());
    params.append('price_max', this.highValue.toString());

    params.append('mileage', this.mileage.toString());

    if(this.startYear !== this.defaultYear) {
      params.append('start_year', this.startYear.toString());
    }
    if(this.endYear !== this.defaultYear) {
      params.append('end_year', this.endYear.toString());
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

    this.search(`${url}?${params.toString()}`);

  }

  onDistanceChange($event: any) {
    const selectElement = $event.target as HTMLInputElement;
    this.distance = Number(selectElement.value);

    const url = this.buildURL();
    const params = this.buildParams();

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
    if(item.type === 'make') {
      let object = this.makes.find(m => m.id === item.id);
      object!.selected = !object!.selected;
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

    this.fillChiplist();
  }

  fillChiplist() {
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

    if(this.startYear !== this.defaultYear && this.endYear !== this.defaultYear) {
      this.chips.push(
        {
          id: 0,
          label: this.startYear + ' - ' + this.endYear,
          type: 'start_year',
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

  @HostListener('window:scroll', ['$event'])
  onScroll(event : any) : void {

    const scrollY = window.scrollY;
    const scrollHeight = document.body.scrollHeight;
    const clientHeight = document.body.clientHeight;
    const scrollPosition = scrollY + clientHeight;

    if (this.last) {
      return;
    }


    console.log(this.loading)
    if(scrollPosition >= scrollHeight - 100 && !this.loading && !this.last) {
      console.log('scrolled to bottom');
      this.page = this.page + 1;
      this.loading = true;


      const url = this.buildURL();
      const params = this.buildParams(this.page);
      const full_path = `${url}?${params.toString()}`;
      console.log(full_path);

    }
  }
}
