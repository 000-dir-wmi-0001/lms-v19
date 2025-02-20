import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinMeetComponent } from './join-meet.component';

describe('JoinMeetComponent', () => {
  let component: JoinMeetComponent;
  let fixture: ComponentFixture<JoinMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinMeetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
