import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeListComponent } from './student-fee-list.component';

describe('StudentFeeListComponent', () => {
  let component: FeeListComponent;
  let fixture: ComponentFixture<FeeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
