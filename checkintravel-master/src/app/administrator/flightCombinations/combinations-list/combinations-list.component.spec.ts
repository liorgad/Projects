import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinationsListComponent } from './combinations-list.component';

describe('CombinationsListComponent', () => {
  let component: CombinationsListComponent;
  let fixture: ComponentFixture<CombinationsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinationsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
