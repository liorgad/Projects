import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirlineDeleteModalComponent } from './airline-delete-modal.component';

describe('AirlineDeleteModalComponent', () => {
  let component: AirlineDeleteModalComponent;
  let fixture: ComponentFixture<AirlineDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirlineDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirlineDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
