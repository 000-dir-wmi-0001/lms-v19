import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExamComponent } from './list-exam.component';

describe('ListExamComponent', () => {
  let component: ListExamComponent;
  let fixture: ComponentFixture<ListExamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListExamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
