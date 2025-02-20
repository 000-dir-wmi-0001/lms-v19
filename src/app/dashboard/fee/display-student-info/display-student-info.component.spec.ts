import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayStudentInfoComponent } from './display-student-info.component';

describe('DisplayStudentInfoComponent', () => {
  let component: DisplayStudentInfoComponent;
  let fixture: ComponentFixture<DisplayStudentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayStudentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayStudentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
