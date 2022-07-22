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
  array = [] as Bookmark[];
  show: Boolean = true;
  throttle = 150;
  scrollDistance = 2;
  scrollUpDistance = 1.5;
  direction = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private service: FavoriteService
  ) { }

  ngOnInit(): void {
    console.log(this.auth.isAuthenticated());
    if(this.auth.isAuthenticated()) {
      this.getBookmark();
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll() {
    console.log("scroll");
    if (this.last) {
      return;
    }
    this.page++;
    this.getBookmark();
  }

  getBookmark() : void {
    this.service.getWatchlist(this.page).subscribe(
      data => {
        this.page = data.pageable.pageNumber;
        this.last = data.last;
        //Add more to list
        console.log(data.content);
        this.array = this.array.concat(data.content);
      }
    )
  }
}
