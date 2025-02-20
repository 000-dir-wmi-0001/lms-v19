import { TestBed } from '@angular/core/testing';

import { LiveClassService } from './live-class.service';

describe('LiveClassService', () => {
  let service: LiveClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
