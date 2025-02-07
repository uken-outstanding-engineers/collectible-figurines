import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFigurineListsComponent } from './user-figurine-lists.component';

describe('UserFigurineListsComponent', () => {
  let component: UserFigurineListsComponent;
  let fixture: ComponentFixture<UserFigurineListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFigurineListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFigurineListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
