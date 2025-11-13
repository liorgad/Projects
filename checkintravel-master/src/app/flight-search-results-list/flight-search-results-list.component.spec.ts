import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchResultsListComponent } from './flight-search-results-list.component';

describe('FlightSearchResultsListComponent', () => {
  let component: FlightSearchResultsListComponent;
  let fixture: ComponentFixture<FlightSearchResultsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchResultsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
