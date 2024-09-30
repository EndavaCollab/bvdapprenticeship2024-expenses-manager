import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { Category, Expense } from '../models';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ReloadService } from '../services/reload-service/reload.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-daily-stats',
  templateUrl: './daily-stats.component.html',
  styleUrls: ['./daily-stats.component.css']
})
export class DailyStatsComponent implements OnInit, OnDestroy {

  @Input() selectedTab="";
  @Input() startDate!:Date;
  @Input() endDate!:Date;

  chartView: [number, number] = [300, 300];
  currentDate = new Date();
  maxDate = new Date(); 
  pickedStartDate = new Date();
  pickedEndDate = new Date();

  categories: Category[] = []; 
  expenses: Expense[] = [];
  data: { name: string, value: number, color: string }[] = [];  
  showChart = false; 

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: []
  };

  private destroy$ = new Subject<void>();

  constructor(public router: Router,
    private expenseService: ExpenseService, 
    private categoryService: CategoryService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    if (this.router.url==='/home'){

      this.setDate();
      this.fetchCategories();
      this.fetchDataForSelectedDate(this.currentDate);
      this.fetchExpenses(this.pickedStartDate, this.pickedEndDate);
    }
    else{
      this.fetchCategories();
      this.fetchExpenses(this.startDate, this.endDate);
      
    }
    this.updateChartView();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateChartView();
      });

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

  fetchExpenses(startDate:Date, endDate:Date): void {
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId"), startDate, endDate, this.reloadService.getCurrentCurrency()).subscribe({
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
      this.fetchDataForSelectedDate(this.currentDate);
    }
  }

  setDate(): void {
    this.pickedStartDate.setHours(0);
    this.pickedStartDate.setMinutes(0);
    this.pickedStartDate.setSeconds(0);
    this.pickedEndDate.setHours(23);
    this.pickedEndDate.setMinutes(59);
    this.pickedEndDate.setSeconds(59);
  }

  previousDay(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.currentDate = new Date(this.currentDate); 
    this.fetchDataForSelectedDate(this.currentDate);
  }

  nextDay(): void {
    const tomorrow = new Date(this.currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow <= this.maxDate) {
      this.currentDate = tomorrow;
      this.fetchDataForSelectedDate(this.currentDate);
    }
  }


  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.description || 'Unknown';
  }
  
  fetchDataForSelectedDate(date: Date): void {
    this.data = [];
    this.pickedStartDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.pickedEndDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    this.fetch(this.pickedStartDate, this.pickedEndDate);
  }
  
  fetch(startDate:Date, endDate:Date): void {
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId"), startDate, endDate, this.reloadService.getCurrentCurrency()).subscribe({
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
  
  updateChartView() {
    if (this.router.url === '/reports') {
      this.chartView = [200, 200]; // Dimensiuni pentru ruta reports
    } else {
      this.chartView = [300, 300]; // Dimensiuni pentru alte rute
    }
  }
}
