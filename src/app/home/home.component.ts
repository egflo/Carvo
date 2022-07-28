import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {HomeService} from "./home.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AutoService} from "../auto/auto.service";
import {Make} from "../api/make";





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
  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  selectedModel= new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  matcher = new ErrorStateMatcher();
  makes: [Make] | undefined
  models: [String] | undefined
  modelsDisabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private homeService: HomeService
  ) {}

  ngOnInit(): void {
    this.homeService.getAllMake().subscribe(makes => {
      this.makes = makes;
    });
  }

  handleMakeSelected() {
    const make = this.selected.value;
    if (make) {
      this.getAllModelsFromMake(make);
    }
  }

  getAllModelsFromMake(make: String): void {
    this.homeService.getAllModelsFromMake(make).subscribe(models => {
      this.models = models;
      this.modelsDisabled = false;
    });
  }

  submit() {
    console.log("submit");
  }

  onBrandClick(event: string) {
    //Get id of clicked brand
    //router
    this.router.navigate(['/results', event]).then(r => {
      console.log("navigation success");
    });
  }

  onTypeClick(type: string) {
    this.router.navigate(['/results', type]).then(r => {
      console.log("navigation success");
    });
  }


}
