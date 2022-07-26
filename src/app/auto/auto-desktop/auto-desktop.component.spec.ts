import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoDesktopComponent } from './auto-desktop.component';

describe('AutoDesktopComponent', () => {
  let component: AutoDesktopComponent;
  let fixture: ComponentFixture<AutoDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoDesktopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
