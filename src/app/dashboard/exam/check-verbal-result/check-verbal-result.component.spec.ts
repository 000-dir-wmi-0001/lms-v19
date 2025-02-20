import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckVerbalResultComponent } from './check-verbal-result.component';

describe('CheckVerbalResultComponent', () => {
  let component: CheckVerbalResultComponent;
  let fixture: ComponentFixture<CheckVerbalResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckVerbalResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckVerbalResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
