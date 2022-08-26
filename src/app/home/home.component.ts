import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {HomeService} from "./home.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AutoService} from "../auto/auto.service";
import {Make} from "../api/make";
import {BodyType} from "../api/body-type";
import {Observable} from "rxjs";





/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  matcher = new ErrorStateMatcher();
  makes: [Make] | undefined
  models: [String] | undefined
  modelsDisabled: boolean = true;

  types$!: Observable<BodyType[]>;


  selected = new FormControl('',[Validators.required]);
  selectedModel= new FormControl({value: '', disabled: false}, [Validators.required]);
  postcodeModel = new FormControl('', [Validators.required, Validators.minLength(5),
    Validators.maxLength(5), Validators.pattern('[0-9]{5}')]);


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {

    this.buildTypes();

    this.homeService.getAllMake().subscribe(makes => {
      this.makes = makes;
    });

    this.selected.valueChanges.subscribe(value => {
      this.getAllModelsFromMake(value!);
    }  );
  }


  buildTypes(): void {
    this.types$ = this.homeService.getAllTypes();
  }

  getAllModelsFromMake(make: String): void {
    this.modelsDisabled = true;
    this.homeService.getAllModelsFromMake(make).subscribe(models => {
      this.models = models;
      console.log(this.models);
      this.modelsDisabled = false;
    });
  }

  onSubmit() {

    //check if fields are valid
    if(this.postcodeModel.invalid || this.selected.invalid || this.selectedModel.invalid) {
      console.log("invalid");
      return;
    }

    console.log("submit");
    this.router.navigate(['/results', this.selected.value, this.selectedModel.value, this.postcodeModel.value]).then(r => {
      console.log("navigation success");
    } ).catch(e => {

      console.log(e.toString());
    } );
  }

  onBrandClick(event: string) {
    //Get id of clicked brand
    //router
    this.router.navigate(['/results', event]).then(r => {
      console.log("navigation success");
    });
  }

  onTypeClick(type: BodyType) {

    console.log(type);
    this.router.navigate(['/results', type.type]).then(r => {
      console.log("navigation success");
    });

    const param = "body=" + type;
    //this.router.navigate(['/results'], {queryParams: {body: type}}).then(r => {
     // console.log("navigation success");
    //});
  }


  findSVG(type: BodyType): string{
    return type.type.toLowerCase()
  }

}
