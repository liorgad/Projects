import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientResultsComponent } from './client-results.component';

describe('ClientResultsComponent', () => {
  let component: ClientResultsComponent;
  let fixture: ComponentFixture<ClientResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
