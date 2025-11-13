import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightOrderDetailsComponent } from './flight-order-details.component';

describe('FlightOrderDetailsComponent', () => {
  let component: FlightOrderDetailsComponent;
  let fixture: ComponentFixture<FlightOrderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightOrderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
