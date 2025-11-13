import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersEditModalComponent } from './orders-edit-modal.component';

describe('OrdersEditModalComponent', () => {
  let component: OrdersEditModalComponent;
  let fixture: ComponentFixture<OrdersEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
