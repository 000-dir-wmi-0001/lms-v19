import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetEnquiryComponent } from './get-enquiry.component';

describe('GetEnquiryComponent', () => {
  let component: GetEnquiryComponent;
  let fixture: ComponentFixture<GetEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetEnquiryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
