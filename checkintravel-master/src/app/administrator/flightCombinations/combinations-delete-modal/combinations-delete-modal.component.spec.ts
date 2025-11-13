import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinationsDeleteModalComponent } from './combinations-delete-modal.component';

describe('CombinationsDeleteModalComponent', () => {
  let component: CombinationsDeleteModalComponent;
  let fixture: ComponentFixture<CombinationsDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinationsDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinationsDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
