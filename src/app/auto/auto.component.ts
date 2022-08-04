import {Component, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {Auto} from "../api/auto";
import {AutoService} from "./auto.service";
import {map, Observable, of} from "rxjs";
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { Router, ParamMap } from '@angular/router';
import {GalleryComponent, GalleryItem, ImageItem} from "ng-gallery";
import {BookmarkRequestModel} from "../model/bookmark-request-model";
import {AuthService} from "../auth.service";
import {Bookmark} from "../api/bookmark";
import {Response} from "../api/response";


@Component({
  selector: 'auto', // Basic CSS selector
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})

export class AutoComponent implements OnInit {
  autoObs!: Observable<Auto>;
  images$!: Observable<GalleryItem[]>;
  bookmark$!: Observable<Bookmark>;

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
  bookmarkExists: Boolean = false;
  bookmarkId: number = 0;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public location: Location,
    public autoService: AutoService,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const id = Number(routeParams.get('id'));

    this.autoService.getAuto(Number(id)).subscribe(response => {
      const keys = response.headers.keys();
      if(response.status == 200) {
        this.autoObs = of(response.body!);
        console.log(response.body);
        if(response.body?.dealer) {
          let dealer = response.body.dealer;
          this.center = {lat: dealer.latitude, lng: dealer.longitude};
        }
        this.images$ = this.autoObs.pipe(
          switchMap(auto => {
            return of(this.buildImageItems(auto));
          }));
      }
      else {
        this.router.navigate(['/']);
      }
    });

    if(this.auth.isAuthenticated()) {
      this.getBookmark(id);
    }
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
  }

  getBookmark(id: Number): void {
    this.autoService.existBookmark(id).subscribe(response => {
      const keys = response.headers.keys();
      if(response.status == 200) {
        this.bookmark$ = of(response.body!);
        this.bookmarkExists = true;
      }
      else {
        this.bookmarkExists = false;
      }
    });
  }

  buildImageItems(auto: Auto): GalleryItem[] {
    let items = []
    for(let i = 0; i < auto.images.length; i++) {
      let image = auto.images[i];
      items.push(new ImageItem({
        thumb: image.url,
        src: image.url,
      }))
    }

    if(items.length == 0) {
      items.push(new ImageItem({
        src: "/assets/images/fallback.png",
        thumb: "/assets/images/fallback.png",
      }));
    }
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

  onBookmarkClick(id: number) {
    if(!this.auth.isAuthenticated()) {
      this.auth.login();
    }
    else {
      const request = {
        id: this.bookmarkId,
        autoId: id,
        userId:1
      } as BookmarkRequestModel;

      if(this.bookmarkExists) {
        this.autoService.removeBookmark(request).subscribe(response => {
          console.log(response.body);
          if(response.status == 200) {
            this.bookmarkExists = false;
          }
          else {
            console.log(response.body);
          }
        });
      }
      else {
        this.autoService.addBookmark(request).subscribe(response => {
          if(response.status == 200) {
            this.bookmarkExists = true;
            this.bookmark$ = of(response.body!);
            this.bookmarkId = response.body!.id;
          }
          else {
            console.log(response.body);
          }
        });
      }
    }
  }

  formatBoolean(value: boolean | undefined): string {
    if(value == undefined) {
      return "N/A";
    }

    if(value) {
      return "Yes";
    }
    else {
      return "No";
    }
  }

  formatCurrency(value: number) : string {
    // Create our number formatter.
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    return formatter.format(value);
  }

  formatRating(rating: number | undefined): any {

    if(rating == undefined) {
      return "";
    }
    return Math.round(rating * 10) / 10;
  }
}
