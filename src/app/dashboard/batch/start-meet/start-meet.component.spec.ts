import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartMeetComponent } from './start-meet.component';

describe('StartMeetComponent', () => {
  let component: StartMeetComponent;
  let fixture: ComponentFixture<StartMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartMeetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
