import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudDashboardComponent } from './stud-dashboard.component';

describe('StudDashboardComponent', () => {
  let component: StudDashboardComponent;
  let fixture: ComponentFixture<StudDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
