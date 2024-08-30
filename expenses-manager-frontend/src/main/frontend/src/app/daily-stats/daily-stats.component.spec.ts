import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStatsComponent } from './daily-stats.component';

describe('DailyStatsComponent', () => {
  let component: DailyStatsComponent;
  let fixture: ComponentFixture<DailyStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
