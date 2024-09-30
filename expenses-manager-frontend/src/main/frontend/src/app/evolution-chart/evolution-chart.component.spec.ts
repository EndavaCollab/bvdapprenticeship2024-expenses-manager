import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvolutionChartComponent } from './evolution-chart.component';

describe('EvolutionChartComponent', () => {
  let component: EvolutionChartComponent;
  let fixture: ComponentFixture<EvolutionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvolutionChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvolutionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
