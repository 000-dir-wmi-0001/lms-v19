import { TestBed } from '@angular/core/testing';

import { PlacementsService } from './placements.service';

describe('PlacementsService', () => {
  let service: PlacementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
