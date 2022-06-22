import { Component, OnInit } from '@angular/core';
import {Auto} from "../api/auto";
import {AutoService} from "./auto.service";
import {Observable, of} from "rxjs";
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'auto', // Basic CSS selector
  templateUrl: './auto.component.html',
  styleUrls: ['./auto.component.css']
})
export class AutoComponent implements OnInit {
  autoObs!: Observable<Auto>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private autoService: AutoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.autoService.getAuto(id).subscribe(
      auto => this.autoObs = of(auto)
    );
  }

  getIcon(description: string) {
    const name = description.toLowerCase()
    if (name.includes('cold')) {
      return 'cold';
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
}
