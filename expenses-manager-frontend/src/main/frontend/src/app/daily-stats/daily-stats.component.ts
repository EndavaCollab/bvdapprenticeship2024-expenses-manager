import { Component, Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent, MatDateRangePicker } from '@angular/material/datepicker';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { Category, Expense } from '../models';
import { ReloadService } from '../services/reload-service/reload.service';
import { Subject, takeUntil } from 'rxjs';

import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';

@Injectable()
export class SevenDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this._createSevenDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createSevenDayRange(activeDate);
  }

  private _createSevenDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -3);
      const end = this._dateAdapter.addCalendarDays(date, 3);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: SevenDayRangeSelectionStrategy,
    },
  ],
})
export class DailyStatsComponent implements OnInit, OnDestroy {

  currentDate = new Date();
  maxDate = new Date(); 
  startDate = new Date();
  endDate = new Date();
  weekMaxDate: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + 3, 23, 59, 59);

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
      case 'Month':
        this.currentDate.setDate(1);
        break;

      case 'Year':
        this.currentDate.setMonth(0);
        this.currentDate.setDate(1);
        break;
    }
  }
  private destroy$ = new Subject<void>();

  constructor(
    private expenseService: ExpenseService, 
    private categoryService: CategoryService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.setDate();
    this.fetchCategories();
    this.fetchDataForSelectedDate();
    this.fetchExpenses();

    this.reloadService.reloadComponents$
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(() => {
        this.fetchDataForSelectedDate(this.currentDate);
      });
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  setWeek(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const updatedDate = new Date();
      updatedDate.setFullYear(event.value.getFullYear(), event.value.getMonth(), event.value.getDate()+3);
      this.currentDate = updatedDate;
      this.fetchDataForSelectedDate();
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
    switch (this._selectedTab) {
      case 'Day':
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        break;

      case 'Week':
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        break;
        
      case 'Month':
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        break;

      case 'Year':
        this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        break;
    }
    this.currentDate = new Date(this.currentDate);
    this.fetchDataForSelectedDate();
  }

  nextPeriod(): void {
    const nextPeriod = new Date(this.currentDate);
    switch (this._selectedTab) {
      case 'Day':
        nextPeriod.setDate(nextPeriod.getDate() + 1);
        break;
        
      case 'Month':
        nextPeriod.setMonth(nextPeriod.getMonth() + 1);
        break;

      case 'Year':
        nextPeriod.setFullYear(nextPeriod.getFullYear() + 1);
        break;
    }
    if (nextPeriod <= this.maxDate) {
      this.currentDate = nextPeriod;
      this.fetchDataForSelectedDate();
    }

    if (this._selectedTab == "Week") {
      nextPeriod.setDate(nextPeriod.getDate() + 7);
    
      const endOfWeek = new Date(nextPeriod);
      endOfWeek.setDate(endOfWeek.getDate() + 3);
      console.log(endOfWeek, this.weekMaxDate) 

      if (endOfWeek <= this.weekMaxDate) {
        this.currentDate = nextPeriod;
        this.fetchDataForSelectedDate();
      }
    }
  }


  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.description || 'Unknown';
  }
  
  fetchDataForSelectedDate(): void {
    this.data = [];
    this.updateStartAndEndDates();
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

    if (this._selectedTab == "Week"){
      this.startDate = new Date(this.currentDate);
      this.startDate.setDate(this.currentDate.getDate() - 3);
      this.endDate = new Date(this.currentDate);
      this.endDate.setDate(this.currentDate.getDate() + 3);
      this.setDate();
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
  
  openDatepicker(datepicker: MatDatepicker<moment.Moment>) {
    datepicker.open();
    this.updateOverlay();
  }

  openWeekDatepicker(datepicker: MatDateRangePicker<Date>) {
    datepicker.open();
    this.updateOverlay();
  }

  private updateOverlay() {
    setTimeout(() => {
      const changeViewButton = document.querySelector('.mat-calendar-period-button');
      if (changeViewButton) {
        if (this.selectedTab !== "Day" && this.selectedTab !== "Week") {
          changeViewButton.classList.add('hide-change-view-button');
        } else {
          changeViewButton.classList.remove('hide-change-view-button');
        }
      }
    }, 0);
  }
}
