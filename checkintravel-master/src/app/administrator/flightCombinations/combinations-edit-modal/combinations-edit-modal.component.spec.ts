import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinationsEditModalComponent } from './combinations-edit-modal.component';

describe('CombinationsEditModalComponent', () => {
  let component: CombinationsEditModalComponent;
  let fixture: ComponentFixture<CombinationsEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinationsEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinationsEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
