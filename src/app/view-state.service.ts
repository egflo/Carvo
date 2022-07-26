import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  private isMobile: boolean = false;

  constructor() {
    this.isMobile = window.innerWidth < 768;
  }

  getIsMobile(): boolean {
    return this.isMobile;
  }
}
