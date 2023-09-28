import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetailesComponent } from './candidate-detailes.component';

describe('CandidateDetailesComponent', () => {
  let component: CandidateDetailesComponent;
  let fixture: ComponentFixture<CandidateDetailesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateDetailesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
