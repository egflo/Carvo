import { Component, OnInit } from '@angular/core';
import {AutoComponent} from "../auto.component";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {Location} from "@angular/common";
import {AutoService} from "../auto.service";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-auto-mobile',
  templateUrl: './auto-mobile.component.html',
  styleUrls: ['./auto-mobile.component.css']
})
export class AutoMobileComponent extends AutoComponent {

  constructor(
    route: ActivatedRoute,
    router: Router,
    location: Location,
    autoService: AutoService,
    auth: AuthService,
  ) {
    super(route, router, location, autoService, auth);
  }
}







