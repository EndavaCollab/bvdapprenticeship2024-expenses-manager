import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsOverviewComponent } from './reports-overview.component';

describe('ReportsOverviewComponent', () => {
  let component: ReportsOverviewComponent;
  let fixture: ComponentFixture<ReportsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
