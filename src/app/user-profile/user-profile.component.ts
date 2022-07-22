import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {HandleError} from "../http-error-handler.service";
import {Observable, of} from "rxjs";
import {User} from "../api/user";


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileJson: string = "";
  user$: Observable<User> | undefined;



  constructor(
    private auth: AuthService,
  ) {}

  ngOnInit(): void {

    if(this.auth.isAuthenticated()) {


      this.user$ = this.auth.getUser();


    }
    else {
      this.auth.login();
    }
  }



}
