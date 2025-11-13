import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSliderComponent } from './search-slider.component';

describe('SearchSliderComponent', () => {
  let component: SearchSliderComponent;
  let fixture: ComponentFixture<SearchSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
