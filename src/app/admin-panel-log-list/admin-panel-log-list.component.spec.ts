import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelLogListComponent } from './admin-panel-log-list.component';

describe('AdminPanelLogListComponent', () => {
  let component: AdminPanelLogListComponent;
  let fixture: ComponentFixture<AdminPanelLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPanelLogListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanelLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
