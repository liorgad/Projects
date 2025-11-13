import { TestBed, async, inject } from '@angular/core/testing';

import { PreloadFlightSearchGuard } from './preload-flight-search.guard';

describe('PreloadFlightSearchGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreloadFlightSearchGuard]
    });
  });

  it('should ...', inject([PreloadFlightSearchGuard], (guard: PreloadFlightSearchGuard) => {
    expect(guard).toBeTruthy();
  }));
});
