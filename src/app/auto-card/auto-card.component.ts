import {Component, Input, OnInit} from '@angular/core';
import {Auto} from "../api/auto";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Observable, of} from "rxjs";
import {Gallery, GalleryItem, GalleryRef, ImageItem} from "ng-gallery";
import {switchMap} from "rxjs/operators";
import {AutoCardService} from "./auto-card.service";
import {BookmarkRequestModel} from "../model/bookmark-request-model";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-auto-card',
  templateUrl: './auto-card.component.html',
  styleUrls: ['./auto-card.component.css']
})
export class AutoCardComponent implements OnInit {
  @Input() auto!: Auto;
  images$!: Observable<GalleryItem[]>;
  alertsEnabled: any;
  bookmarkExists: Boolean = false;
  bookmarkId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private gallery: Gallery,
    private service: AutoCardService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const galleryRef: GalleryRef = this.gallery.ref('gallery-' + this.auto.id);
    galleryRef.load(this.buildImageItems(this.auto));

    if(this.auth.isAuthenticated()) {
      this.getBookmark();
    }
  }

  getBookmark(): void {
    this.service.existBookmark(this.auto.id).subscribe(response => {
      const keys = response.headers.keys();
      if(response.status == 200) {
        this.bookmarkExists = true;
        this.bookmarkId = response.body!.id;
      }
      else {
        this.bookmarkExists = false;
      }
    });
  }

  buildImageItems(auto: Auto): GalleryItem[] {
    let items = []
    if(auto.stockImage) {

      if (auto.stockImage.imageAngularFront) {
        items.push(new ImageItem({
          src: auto.stockImage.imageAngularFront,
          thumb: auto.stockImage.imageAngularFront,
        }));
      }

      if (auto.stockImage.imageFront) {
        items.push(new ImageItem({
          src: auto.stockImage.imageFront,
          thumb: auto.stockImage.imageFront,
        }));
      }
      if (auto.stockImage.imageRear) {
        items.push( new ImageItem({
          src: auto.stockImage.imageRear,
          thumb: auto.stockImage.imageRear,
        }));
      }

      if (auto.stockImage.imageAngularRear) {
        items.push( new ImageItem({
          src: auto.stockImage.imageAngularRear,
          thumb: auto.stockImage.imageAngularRear,
        }));
      }

      if (auto.stockImage.imageSide) {
        items.push( new ImageItem({
          src: auto.stockImage.imageSide,
          thumb: auto.stockImage.imageSide,
        }));
      }
    }

    if(items.length == 0) {
      items.push(new ImageItem({
        src: "/assets/images/fallback.png",
        thumb: "/assets/images/fallback.png",
      }));
    }
    return items;
  }

  onClick(id: number) {
    console.log("onClick" + id);
    this.router.navigate(['/auto', id]).then(r =>  {}).catch(e => console.log(e));
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

  formatMiles(value: number) : string {
    let formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(value);
  }

  onBookmarkClick(id: number): void {
    console.log("onBookmarkClick" + id);
    if(this.auth.isAuthenticated()) {
      const request = {
        autoId: id,
        userId: 1
      } as BookmarkRequestModel;

      this.service.updateBookmark(request).subscribe(response => {
        if (response.status == 200) {
          this.getBookmark();
        } else {
          this.bookmarkExists = false;
        }
      });
    }
    else {
      console.log("Not authenticated");
    }
  }
}
