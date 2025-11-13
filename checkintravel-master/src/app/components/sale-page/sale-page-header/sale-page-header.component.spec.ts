import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePageHeaderComponent } from './sale-page-header.component';

describe('SalePageHeaderComponent', () => {
  let component: SalePageHeaderComponent;
  let fixture: ComponentFixture<SalePageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalePageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
