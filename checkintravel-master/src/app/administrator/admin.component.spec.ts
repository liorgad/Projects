import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AdminComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AdminComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'checkintravel-admin'`, () => {
    const fixture = TestBed.createComponent(AdminComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('checkintravel-admin');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to checkintravel-admin!');
  });
});
