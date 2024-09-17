import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';

interface Category {
  id: number;
  name: string;
  colorCode: string;
}

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit {

  currentDate = new Date();

  categories: Category[] = [
    { id: 1, name: 'Food & Restaurants', colorCode: '#46B1D9' },
    { id: 2, name: 'Car', colorCode: '#5844E3' },
    { id: 3, name: 'Subscriptions', colorCode: '#E047AB' },
    { id: 4, name: 'Entertainment', colorCode: '#F78486' },
    { id: 5, name: 'Coffee', colorCode: '#A1D12E' }
  ];

  data = this.categories.map(category => ({ name: category.name, value: this.getRandomValue() }));

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.categories.map(category => category.colorCode)
  };

  constructor() { }

  ngOnInit(): void { }

  getRandomValue(): number {
    return Math.floor(Math.random() * 100); 
  }

  onDateChange(event: any): void {
    if (event.value) {
      this.currentDate = event.value;
      this.fetchDataForSelectedDate(this.currentDate);
    }
  }

  previousDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.currentDate = new Date(this.currentDate); 
    this.fetchDataForSelectedDate(this.currentDate);
  }

  nextDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate = new Date(this.currentDate); 
    this.fetchDataForSelectedDate(this.currentDate);
  }

  fetchDataForSelectedDate(date: Date): void {
    console.log('Fetching data for:', date);
  }
}