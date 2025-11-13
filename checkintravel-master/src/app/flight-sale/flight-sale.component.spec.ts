import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightSaleComponent } from './flight-sale.component';

describe('FlightSaleComponent', () => {
  let component: FlightSaleComponent;
  let fixture: ComponentFixture<FlightSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
