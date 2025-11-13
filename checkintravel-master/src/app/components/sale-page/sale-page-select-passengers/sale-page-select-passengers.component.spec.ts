import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePageSelectPassengersComponent } from './sale-page-select-passengers.component';

describe('SalePageSelectPassengersComponent', () => {
  let component: SalePageSelectPassengersComponent;
  let fixture: ComponentFixture<SalePageSelectPassengersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePageSelectPassengersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalePageSelectPassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
