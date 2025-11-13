import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDeleteModalComponent } from './flight-delete-modal.component';

describe('FlightDeleteModalComponent', () => {
  let component: FlightDeleteModalComponent;
  let fixture: ComponentFixture<FlightDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
