import { TestBed } from '@angular/core/testing';

import { FlightSearchService } from './flight-search.service';

describe('FlightSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlightSearchService = TestBed.get(FlightSearchService);
    expect(service).toBeTruthy();
  });
});
