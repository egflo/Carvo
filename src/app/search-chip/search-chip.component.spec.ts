import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChipComponent } from './search-chip.component';

describe('SearchChipComponent', () => {
  let component: SearchChipComponent;
  let fixture: ComponentFixture<SearchChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchChipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
