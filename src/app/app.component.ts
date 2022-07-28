import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import {Router} from "@angular/router";
import {Location} from "@angular/common";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Carvo';
  constructor(
    private router: Router,
    private location: Location,
    private matIconRegistry: MatIconRegistry
    , private domSanitizer: DomSanitizer) {
      this.matIconRegistry.addSvgIcon(
        "wheel",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/wheel_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "car",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/car_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "bluetooth",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/bluetooth_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "camera",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/camera_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "cold",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cold_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "drivetrain",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/drivetrain_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "engine",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/engine_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "fuel",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/fuel_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "heat",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/heat_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "interior",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/interior_color_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "mileage",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/mileage_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "mpg",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/mpg_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "navigation",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/navigation_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "owner",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/owner_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "premium",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/premium_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "sports",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/sports_car_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "sunroof",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/sunroof_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "technology",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/technology_icon.svg")
      ),
      this.matIconRegistry.addSvgIcon(
        "transmission",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/transmission_icon.svg")
      ),
    this.matIconRegistry.addSvgIcon(
      "color",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/color_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "crewcab",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/crewcab_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "coupe",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/coupe_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "crossover",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/crossover_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "sedan",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/sedan_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "suv",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/suv_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "truck",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/truck_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "chevrolet",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/chevrolet_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "ford",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/ford_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "toyota",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/toyota_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "gmc",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/gmc_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "honda",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/honda_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "dodge",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/dodge_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "jeep",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/jeep_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "bmw",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/bmw_icon.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "mercedes",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/mercedes_icon.svg")
    ),
    this.matIconRegistry.addSvgIcon(
      "audi",
      this.domSanitizer.bypassSecurityTrustResourceUrl("assets/brands/audi_icon.svg")
    );
  }

  onFavoriteClick() {
    this.router.navigate(["/favorites"]);
  }

  onUserClick() {
    this.router.navigate(["/user"]);
  }

  onHomeClick() {
    this.router.navigate(["/"]);
  }
}
