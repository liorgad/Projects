import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchResultsComponent } from './flight-search-results.component';

describe('FlightSearchResultsComponent', () => {
  let component: FlightSearchResultsComponent;
  let fixture: ComponentFixture<FlightSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
