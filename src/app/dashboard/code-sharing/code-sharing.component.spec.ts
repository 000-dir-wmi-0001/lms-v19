import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSharingComponent } from './code-sharing.component';

describe('CodeSharingComponent', () => {
  let component: CodeSharingComponent;
  let fixture: ComponentFixture<CodeSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeSharingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
