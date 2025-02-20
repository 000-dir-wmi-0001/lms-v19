import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptCodingExamComponent } from './attempt-coding-exam.component';

describe('AttemptCodingExamComponent', () => {
  let component: AttemptCodingExamComponent;
  let fixture: ComponentFixture<AttemptCodingExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttemptCodingExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttemptCodingExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
