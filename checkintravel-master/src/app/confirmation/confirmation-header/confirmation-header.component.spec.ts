import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationHeaderComponent } from './confirmation-header.component';

describe('ConfirmationHeaderComponent', () => {
  let component: ConfirmationHeaderComponent;
  let fixture: ComponentFixture<ConfirmationHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
