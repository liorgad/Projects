import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDeleteModalComponent } from './location-delete-modal.component';

describe('LocationDeleteModalComponent', () => {
  let component: LocationDeleteModalComponent;
  let fixture: ComponentFixture<LocationDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
