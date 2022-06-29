import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Auto} from "../api/auto";
import {AutoService} from "./auto.service";
import {map, Observable, of} from "rxjs";
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Router, ParamMap } from '@angular/router';
import {GalleryComponent, GalleryItem, ImageItem} from "ng-gallery";


@Component({
  selector: 'auto', // Basic CSS selector
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})

export class AutoComponent implements OnInit {
  autoObs!: Observable<Auto>;
  images$!: Observable<GalleryItem[]>;

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

    this.autoService.getAuto(Number(id)).subscribe(auto => {
      this.autoObs = of(auto);
      if(auto?.dealer) {
        let dealer = auto.dealer;
        this.center = {lat: dealer.latitude, lng: dealer.longitude};
      }

      this.images$ = this.autoObs.pipe(
        switchMap(auto => {
          return of(this.buildImageItems(auto));
        }));
    });



  }



  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }

  buildImageItems(auto: Auto): GalleryItem[] {
    let items = []

    let angularFront = new ImageItem({
      thumb: auto.stockImage!.imageAngularFront,
      src: auto.stockImage!.imageAngularFront,
    });

    let frontView = new ImageItem({
      thumb: auto.stockImage!.imageFront,
      src: auto.stockImage!.imageFront,
    });

    let sideView = new ImageItem({
      thumb: auto.stockImage!.imageSide,
      src: auto.stockImage!.imageSide,
    });

    let backView = new ImageItem({
      thumb: auto.stockImage!.imageRear,
      src: auto.stockImage!.imageRear,
    });

    let angularBack = new ImageItem({
      thumb: auto.stockImage!.imageAngularRear,
      src: auto.stockImage!.imageAngularRear,
    });

    items.push(angularFront);
    items.push(frontView);
    items.push(sideView);
    items.push(backView);
    items.push(angularBack);

    for(let i = 0; i < auto.images.length; i++) {
      let image = auto.images[i];
      items.push(new ImageItem({
        thumb: image.url,
        src: image.url,
      }))
    }

    console.log(items);
    return items;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const id = route.paramMap.get('id');
    console.log("canActivate: " + id);
    return true;
  }

  getIcon(description: string): string {
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

  getImage(auto: Auto): string {

    if (auto.stockImage != null) {
      return auto.stockImage.imageAngularFront;
    }

    else {
      return auto.mainPictureUrl;
    }

  }
}
