import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFeeComponent } from './edit-fee.component';

describe('EditFeeComponent', () => {
  let component: EditFeeComponent;
  let fixture: ComponentFixture<EditFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
