import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSalesComponent } from './flight-sales.component';

describe('FlightSalesComponent', () => {
  let component: FlightSalesComponent;
  let fixture: ComponentFixture<FlightSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
