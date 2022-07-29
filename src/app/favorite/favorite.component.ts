import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {Bookmark} from "../api/bookmark";
import {FavoriteService} from "./favorite.service";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  page: number = 0;
  last: Boolean = false;
  array = [] as any[];
  show: Boolean = true;
  loading: boolean = false;
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";
  modalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private service: FavoriteService
  ) {

  }

  ngOnInit(): void {
    if(this.auth.isAuthenticated()) {
      this.getBookmark();
    }
  }

  //@HostListener('window:scroll', ['$event'])
  onScroll() {
    if (this.last) {
      return;
    }
    this.page++;
    this.getBookmark();
  }

  getBookmark() : void {
    console.log(this.page);
    this.loading = true;
    this.service.getWatchlist(this.page).subscribe(
      data => {
        console.log("Get Watchlist Success");
        this.page = data.pageable.pageNumber;
        this.last = data.last;
        //Add more to list
        this.array = this.array.concat(data.content);
        this.loading = false;
      }
    )
  }
}
