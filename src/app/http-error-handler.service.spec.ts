import { TestBed } from '@angular/core/testing';

import { HttpErrorHandler.ServiceService } from './http-error-handler.service.service';

describe('HttpErrorHandler.ServiceService', () => {
  let service: HttpErrorHandler.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpErrorHandler.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
