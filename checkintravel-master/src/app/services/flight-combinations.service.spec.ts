import { TestBed } from '@angular/core/testing';

import { FlightCombinationsService } from './flight-combinations.service';

describe('FlightCombinationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlightCombinationsService = TestBed.get(FlightCombinationsService);
    expect(service).toBeTruthy();
  });
});
