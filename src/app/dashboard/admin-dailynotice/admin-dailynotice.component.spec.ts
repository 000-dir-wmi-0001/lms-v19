import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDailynoticeComponent } from './admin-dailynotice.component';

describe('AdminDailynoticeComponent', () => {
  let component: AdminDailynoticeComponent;
  let fixture: ComponentFixture<AdminDailynoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDailynoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDailynoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
