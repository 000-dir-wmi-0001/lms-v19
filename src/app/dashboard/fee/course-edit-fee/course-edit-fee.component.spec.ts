import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseEditFeeComponent } from './course-edit-fee.component';

describe('CourseEditFeeComponent', () => {
  let component: CourseEditFeeComponent;
  let fixture: ComponentFixture<CourseEditFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseEditFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseEditFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
