import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSearchResultsListItemComponent } from './flight-search-results-list-item.component';

describe('FlightSearchResultsListItemComponent', () => {
  let component: FlightSearchResultsListItemComponent;
  let fixture: ComponentFixture<FlightSearchResultsListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSearchResultsListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSearchResultsListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
