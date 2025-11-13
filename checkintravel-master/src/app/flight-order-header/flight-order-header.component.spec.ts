import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightOrderHeaderComponent } from './flight-order-header.component';

describe('FlightOrderHeaderComponent', () => {
  let component: FlightOrderHeaderComponent;
  let fixture: ComponentFixture<FlightOrderHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightOrderHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightOrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
