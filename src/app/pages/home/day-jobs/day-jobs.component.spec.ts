import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayJobsComponent } from './day-jobs.component';

describe('DayJobsComponent', () => {
  let component: DayJobsComponent;
  let fixture: ComponentFixture<DayJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayJobsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
