import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelFandomsListComponent } from './admin-panel-fandoms-list.component';

describe('AdminPanelFandomsListComponent', () => {
  let component: AdminPanelFandomsListComponent;
  let fixture: ComponentFixture<AdminPanelFandomsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPanelFandomsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanelFandomsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
