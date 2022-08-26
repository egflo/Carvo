import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../auth.service";
import {Bookmark} from "../api/bookmark";
import {FavoriteService} from "./favorite.service";
import {Search} from "../api/search";
import {SnackbarService} from "../snackbar.service";

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

  searches = [] as any[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private service: FavoriteService,
    protected snackBar: SnackbarService,
  ) {

  }

  ngOnInit(): void {
    if(this.auth.isAuthenticated()) {
      this.getBookmark();
      this.getSearchlist();
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

  getSearchlist() : void {
    this.service.getSearchlist().subscribe(
      data => {
        console.log("Get Searchlist Success");
        this.searches = data;
        console.log(this.searches);
      }
    )
  }

  getBookmark() : void {
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

  remove(search: Search) {

    this.service.deleteSearch(search).subscribe(
      data => {
        this.snackBar.openSnackBar("Search removed from watchlist");
        this.searches = this.searches.filter(s => s !== search);
      })

  }

  onClick(search: Search) {
    const query = search.query.split("?")
    //const path = "/results/" + search.query;
    console.log(query);
    const url = encodeURI(search.query);
    //this.router.navigate(['/results', url]);
    //this.router.navigate(['/results' + url]);

  }
}
