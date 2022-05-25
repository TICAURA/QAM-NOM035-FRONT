import { TestBed } from '@angular/core/testing';

import { HttpSenderService } from './http-sender.service';

describe('HttpSenderService', () => {
  let service: HttpSenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpSenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
