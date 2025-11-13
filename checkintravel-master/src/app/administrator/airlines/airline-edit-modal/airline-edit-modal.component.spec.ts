import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineEditModalComponent } from './airline-edit-modal.component';

describe('AirlineEditModalComponent', () => {
  let component: AirlineEditModalComponent;
  let fixture: ComponentFixture<AirlineEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
