import { Component, Input, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { Category, Expense } from '../models';

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.scss']
})
export class DailyStatsComponent implements OnInit {

  currentDate = new Date();
  maxDate = new Date(); 
  startDate = new Date();
  endDate = new Date();

  categories: Category[] = []; 
  expenses: Expense[] = [];
  data: { name: string, value: number, color: string }[] = [];  
  showChart = false; 

  private _selectedTab = ''; 

  @Input()
  set selectedTab(value: string) {
    if (value !== this._selectedTab) { 
      this._selectedTab = value;  
      this.onTabChange(); 
    }
  }

  get selectedTab(): string {
    return this._selectedTab;
  }

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: []
  };

  onTabChange() {
    switch (this._selectedTab) {
      case 'Day':
        break;

      case 'Week':
        break;

      case 'Month':
        this.currentDate.setDate(1);
        break;

      case 'Year':
        this.currentDate.setMonth(0);
        this.currentDate.setDate(1);
        break;

      case 'Custom':
        break;
    }
  }

  constructor(
    private expenseService: ExpenseService, 
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.setDate();
    this.fetchCategories();
    this.fetchDataForSelectedDate();
    this.fetchExpenses();
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) => {
      this.categories = categories;
      this.colorScheme.domain = categories.map(cat => cat.color);
    });
  }

  fetchExpenses(): void {
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId"), this.startDate, this.endDate).subscribe({
      next: (expenses: Expense[]) => {
        this.expenses = expenses;
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.currentDate = event.value;
      this.fetchDataForSelectedDate();
    }
  }

  setYear(date: Date, datepicker: MatDatepicker<Date>) {
    if (date) {
      const updatedDate = new Date(this.currentDate);
      updatedDate.setFullYear(date.getFullYear());
      this.currentDate = updatedDate;

      this.fetchDataForSelectedDate();
      datepicker.close();
    }
  }

  setMonth(date: Date, datepicker: MatDatepicker<Date>) {
    if (date) {
      const updatedDate = new Date(this.currentDate);
      updatedDate.setFullYear(date.getFullYear(), date.getMonth());
      this.currentDate = updatedDate;
      this.fetchDataForSelectedDate();
      datepicker.close();
    }
  }

  setDate(): void {
    this.startDate.setHours(0);
    this.startDate.setMinutes(0);
    this.startDate.setSeconds(0);
    this.endDate.setHours(23);
    this.endDate.setMinutes(59);
    this.endDate.setSeconds(59);
  }

  previousPeriod(): void {
    if (this._selectedTab == "Year") {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
      this.currentDate = new Date(this.currentDate);
    }
    if (this._selectedTab == "Month") {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.currentDate = new Date(this.currentDate);
    }
    if (this._selectedTab == "Day") {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
      this.currentDate = new Date(this.currentDate);
    }
    this.fetchDataForSelectedDate();
  }

  nextPeriod(): void {
    const tomorrow = new Date(this.currentDate);
    if (this._selectedTab == "Year") {
      tomorrow.setFullYear(tomorrow.getFullYear() + 1);
    }
    if (this._selectedTab == "Month") {
      tomorrow.setMonth(tomorrow.getMonth() + 1);
    }
    if (this._selectedTab == "Day") {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    if (tomorrow <= this.maxDate) {
      this.currentDate = tomorrow;
      this.fetchDataForSelectedDate();
    }
  }


  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.description || 'Unknown';
  }
  
  fetchDataForSelectedDate(): void {
    this.data = [];
    this.updateStartAndEndDates()
    this.fetch();
  }

  updateStartAndEndDates() {
    if (this._selectedTab=="Year"){
      this.startDate.setFullYear(this.currentDate.getFullYear(), 0, 1);
      this.endDate.setFullYear(this.currentDate.getFullYear(), 11, 31);
    }
    if (this._selectedTab=="Month"){
      this.startDate.setFullYear(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(this.startDate);
      lastDayOfMonth.setMonth(this.startDate.getMonth() + 1);
      lastDayOfMonth.setDate(this.startDate.getDate() - 1);
      
      lastDayOfMonth.setHours(23);
      lastDayOfMonth.setMinutes(59);
      lastDayOfMonth.setSeconds(59);
      this.endDate = lastDayOfMonth;
    }

    if (this._selectedTab == "Day") {
      this.startDate.setFullYear(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
      this.endDate.setFullYear(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
    }
  }
  
  fetch(): void {
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId"), this.startDate, this.endDate).subscribe({
      next: (expenses: Expense[]) => {
        this.expenses = expenses;
        if (expenses.length === 0) {
          this.data = []; 
          this.showChart = false; 
          return; 
        }
  
        const categoryTotals: { [key: string]: number } = {};
        expenses.forEach(expense => {
          const category = this.categories.find(cat => cat.id === expense.categoryId);
          if (category) {
            const categoryName = category.description;
            if (!categoryTotals[categoryName]) {
              categoryTotals[categoryName] = 0;
            }
            categoryTotals[categoryName] += expense.amount;
          }
        });
  
        this.data = Object.entries(categoryTotals)
          .filter(([_, total]) => total > 0)
          .map(([name, total]) => {
            const category = this.categories.find(cat => cat.description === name);
            return {
              name,
              value: total,
              color: category ? category.color : '#ccc'
            };
          });
  
        this.colorScheme.domain = this.data.map(d => d.color);
        this.showChart = this.data.length > 0; 
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }
  getFilteredCategories(): Category[] {
    const categoryNames = this.data.map(d => d.name);
    return this.categories.filter(cat => categoryNames.includes(cat.description));
  }
  
}
