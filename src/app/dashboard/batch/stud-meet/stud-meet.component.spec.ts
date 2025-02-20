import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudMeetComponent } from './stud-meet.component';

describe('StudMeetComponent', () => {
  let component: StudMeetComponent;
  let fixture: ComponentFixture<StudMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudMeetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
