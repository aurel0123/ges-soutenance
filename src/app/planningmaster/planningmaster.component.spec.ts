import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningmasterComponent } from './planningmaster.component';

describe('PlanningmasterComponent', () => {
  let component: PlanningmasterComponent;
  let fixture: ComponentFixture<PlanningmasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningmasterComponent]
    });
    fixture = TestBed.createComponent(PlanningmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
