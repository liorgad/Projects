import { TestBed } from '@angular/core/testing';

import { NgbTimepickerAdapterService } from './ngb-timepicker-adapter.service';

describe('NgbTimepickerAdapterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgbTimepickerAdapterService = TestBed.get(NgbTimepickerAdapterService);
    expect(service).toBeTruthy();
  });
});
