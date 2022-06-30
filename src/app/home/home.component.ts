import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {HomeService} from "./home.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AutoService} from "../auto/auto.service";
import {Make} from "../api/make";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);
  nativeSelectFormControl = new FormControl('valid', [
    Validators.required,
    Validators.pattern('valid'),
  ]);

  matcher = new ErrorStateMatcher();
  makes: [Make] | undefined
  models: [String] | undefined

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
    console.log("getAllModelsFromMake: " + make);
    this.homeService.getAllModelsFromMake(make).subscribe(models => {
      this.models = models;
    });
  }

  submit() {
    console.log("submit");
  }

  onBrandClick(event: string) {
    console.log("onBrandClick: " + event);
    //Get id of clicked brand
    //router
    this.router.navigate(['/results', event]).then(r => {
      console.log("navigation success");
    });

  }

  onTypeClick(type: string) {
    console.log("onTypeClick: " + type);
    this.router.navigate(['/results', type]).then(r => {
      console.log("navigation success");
    });
  }
}
