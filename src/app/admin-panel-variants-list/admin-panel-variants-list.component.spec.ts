import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelVariantsListComponent } from './admin-panel-variants-list.component';

describe('AdminPanelVariantsListComponent', () => {
  let component: AdminPanelVariantsListComponent;
  let fixture: ComponentFixture<AdminPanelVariantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPanelVariantsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanelVariantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
