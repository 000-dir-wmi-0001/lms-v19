import { TestBed } from '@angular/core/testing';

import { BatchStateService } from './batch-state.service';

describe('BatchStateService', () => {
  let service: BatchStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
