import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarriernComponent } from './carriern.component';

describe('CarriernComponent', () => {
  let component: CarriernComponent;
  let fixture: ComponentFixture<CarriernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarriernComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarriernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
