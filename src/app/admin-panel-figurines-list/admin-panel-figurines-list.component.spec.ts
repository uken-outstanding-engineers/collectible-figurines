import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelFigurinesListComponent } from './admin-panel-figurines-list.component';

describe('AdminPanelFigurinesListComponent', () => {
  let component: AdminPanelFigurinesListComponent;
  let fixture: ComponentFixture<AdminPanelFigurinesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPanelFigurinesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanelFigurinesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
