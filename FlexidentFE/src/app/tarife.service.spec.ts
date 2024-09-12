import { TestBed } from '@angular/core/testing';

import { TarifeService } from './tarife.service';

describe('TarifeService', () => {
  let service: TarifeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarifeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
