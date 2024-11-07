import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiguresShowcaseComponent } from './figures-showcase.component';

describe('FiguresShowcaseComponent', () => {
  let component: FiguresShowcaseComponent;
  let fixture: ComponentFixture<FiguresShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiguresShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiguresShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
