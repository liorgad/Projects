import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersDeleteModalComponent } from './orders-delete-modal.component';

describe('OrdersDeleteModalComponent', () => {
  let component: OrdersDeleteModalComponent;
  let fixture: ComponentFixture<OrdersDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
