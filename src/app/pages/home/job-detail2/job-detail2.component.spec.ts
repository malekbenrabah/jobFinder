import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetail2Component } from './job-detail2.component';

describe('JobDetail2Component', () => {
  let component: JobDetail2Component;
  let fixture: ComponentFixture<JobDetail2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobDetail2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetail2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
