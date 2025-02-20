import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudDailynoticeComponent } from './stud-dailynotice.component';

describe('StudDailynoticeComponent', () => {
  let component: StudDailynoticeComponent;
  let fixture: ComponentFixture<StudDailynoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudDailynoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudDailynoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
