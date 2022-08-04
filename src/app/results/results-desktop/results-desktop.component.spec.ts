import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsDesktopComponent } from './results-desktop.component';

describe('ResultsDesktopComponent', () => {
  let component: ResultsDesktopComponent;
  let fixture: ComponentFixture<ResultsDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsDesktopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultsDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
