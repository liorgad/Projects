import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchResultsHeaderComponent } from './flight-search-results-header.component';

describe('FlightSearchResultsHeaderComponent', () => {
  let component: FlightSearchResultsHeaderComponent;
  let fixture: ComponentFixture<FlightSearchResultsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchResultsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchResultsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
