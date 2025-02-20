import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPassComponent } from './footer-pass.component';

describe('FooterPassComponent', () => {
  let component: FooterPassComponent;
  let fixture: ComponentFixture<FooterPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterPassComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
