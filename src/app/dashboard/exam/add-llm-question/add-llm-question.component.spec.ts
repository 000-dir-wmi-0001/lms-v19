import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLlmQuestionComponent } from './add-llm-question.component';

describe('AddLlmQuestionComponent', () => {
  let component: AddLlmQuestionComponent;
  let fixture: ComponentFixture<AddLlmQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLlmQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLlmQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
