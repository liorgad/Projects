import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightEditModalComponent } from './flight-edit-modal.component';

describe('FlightEditModalComponent', () => {
  let component: FlightEditModalComponent;
  let fixture: ComponentFixture<FlightEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
