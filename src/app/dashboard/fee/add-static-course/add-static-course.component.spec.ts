import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaticCourseComponent } from './add-static-course.component';

describe('AddStaticCourseComponent', () => {
  let component: AddStaticCourseComponent;
  let fixture: ComponentFixture<AddStaticCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStaticCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStaticCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
