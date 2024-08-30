import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit {

  data: any[] = [
    { name: 'Food & Restaurants', value: 30 },
    { name: 'Car', value: 25 },
    { name: 'Subscriptions', value: 20 },
    { name: 'Entertainment', value: 15 },
    { name: 'Coffee', value: 10 }
  ];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#46B1D9', '#5844E3', '#E047AB', '#F78486', '#A1D12E']
  };

  constructor() { }

  ngOnInit(): void {
  }
}
