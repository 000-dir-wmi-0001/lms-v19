import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStudentVerbalResultComponent } from './check-student-verbal-result.component';

describe('CheckStudentVerbalResultComponent', () => {
  let component: CheckStudentVerbalResultComponent;
  let fixture: ComponentFixture<CheckStudentVerbalResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckStudentVerbalResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckStudentVerbalResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
