import { Component, OnInit } from '@angular/core';
import {Auto} from "../api/auto";
import {AutoService} from "./auto.service";
import {Observable, of} from "rxjs";
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Router, ParamMap } from '@angular/router';


@Component({
  selector: 'auto', // Basic CSS selector
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})

export class AutoComponent implements OnInit {
  autoObs!: Observable<Auto>;
  auto: Auto | undefined;

  center: google.maps.LatLngLiteral = {lat: 50.06465, lng: 19.94498};
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  }
  zoom: number = 12;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private autoService: AutoService
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));
    console.log("id: " + id);

    this.autoService.getAuto(Number(id)).subscribe(auto => {
      this.autoObs = of(auto);
      //this.auto = auto;
      if(auto?.dealer) {
        let dealer = auto.dealer;
        this.center = {lat: dealer.latitude, lng: dealer.longitude};
      }
    });
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const id = route.paramMap.get('id');
    console.log("canActivate: " + id);
    return true;
  }

  getIcon(description: string) {
    const name = description.toLowerCase()
    if (name.includes('cold')) {
      return 'cold';
    }  else if (name.includes('wheel')) {
      return 'wheel';
    } else if (name.includes('leather')) {
      return 'interior';
    } else if (name.includes('sport')) {
      return 'sports';
    } else if (name.includes('tech')) {
      return 'technology';
    } else if (name.includes('heat')) {
      return 'heat';
    } else if (name.includes('navigation')) {
      return 'navigation';
    } else if (name.includes('sunroof')) {
      return 'sunroof';
    }  else if (name.includes('power')) {
      return 'engine';
    }  else if (name.includes('camera')) {
      return 'camera';
    } else if (name.includes('bluetooth')) {
      return 'bluetooth';
    }
    else if (name.includes('premium')) {
      return 'premium';
    }

    return 'car';
  }

  isCrewCab(auto: Auto) {
    const name = auto.body.cabin.toLowerCase()
    return !name.includes('crew cab')
  }
}
