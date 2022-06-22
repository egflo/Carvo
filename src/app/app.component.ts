import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Carvo';
  constructor(private matIconRegistry: MatIconRegistry
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
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/cold_icon.svg")),
      this.matIconRegistry.addSvgIcon(
        "drivetrain",
        this.domSanitizer.bypassSecurityTrustResourceUrl("assets/icons/drivetrain_icon.svg"))
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
      );
  }
}
