import {Component, Input, OnInit} from '@angular/core';
import {Auto} from "../api/auto";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {Observable, of} from "rxjs";
import {Gallery, GalleryItem, GalleryRef, ImageItem} from "ng-gallery";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-auto-card',
  templateUrl: './auto-card.component.html',
  styleUrls: ['./auto-card.component.css']
})
export class AutoCardComponent implements OnInit {
  @Input() auto!: Auto;
  images$!: Observable<GalleryItem[]>;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private gallery: Gallery
  ) {}

  ngOnInit(): void {
    const galleryRef: GalleryRef = this.gallery.ref('gallery-' + this.auto.id);
    //this.images$ = of(this.buildImageItems(this.auto));

    galleryRef.load(this.buildImageItems(this.auto));
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


    for(let i = 0; i < auto.images.length; i++) {
      let image = auto.images[i];
      //items.push(new ImageItem({
      //  thumb: image.url,
      //  src: image.url,
     // }))
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

  getImage(auto: Auto) {
    if (auto.images && auto.images.length > 0) {
      return auto.images[0].url;
    }
    return "https://via.placeholder.com/150";

  }
}
