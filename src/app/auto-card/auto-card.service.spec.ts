import { TestBed } from '@angular/core/testing';

import { AutoCardService } from './auto-card.service';

describe('AutoCardService', () => {
  let service: AutoCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
