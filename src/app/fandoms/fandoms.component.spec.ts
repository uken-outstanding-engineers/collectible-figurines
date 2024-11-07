import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FandomsComponent } from './fandoms.component';

describe('FandomsComponent', () => {
  let component: FandomsComponent;
  let fixture: ComponentFixture<FandomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FandomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FandomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
