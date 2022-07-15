import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ResultsService} from "../results/results.service";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../auth.service";
import {WatchlistService} from "./watchlist.service";
import {Bookmark} from "../api/bookmark";

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  array = [] as Bookmark[];
  throttle = 150;
  scrollDistance = 2;
  scrollUpDistance = 1.5;
  direction = "";

  page: number = 0;
  last: Boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private service: WatchlistService
  ) {}

  ngOnInit() {
    this.getBookmark();
  }

  getBookmark() : void {
    console.log("getBookmark");
    this.service.getWatchlist(this.page).subscribe(
      data => {
        console.log(data);
        this.page = data.pageable.pageNumber;
        this.last = data.last;
        //Add more to list
        this.array = this.array.concat(data.content);
      }
    )
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
}
