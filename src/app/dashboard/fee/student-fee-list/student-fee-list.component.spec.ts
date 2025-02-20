import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeeListComponent } from './student-fee-list.component';

describe('StudentFeeListComponent', () => {
  let component: StudentFeeListComponent;
  let fixture: ComponentFixture<StudentFeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFeeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
