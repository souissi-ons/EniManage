import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventManagementComponent } from './admin-event-management.component';

describe('AdminEventManagementComponent', () => {
  let component: AdminEventManagementComponent;
  let fixture: ComponentFixture<AdminEventManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEventManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEventManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
