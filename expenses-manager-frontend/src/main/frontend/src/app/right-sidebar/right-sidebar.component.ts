import { Component, OnInit } from '@angular/core';
import { Category, Currency, Expense } from '../models';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { ReloadService } from '../services/reload-service/reload.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  categories: Category[] = [];
  currencies: Currency[] = [];
  expenses: Map<Date, Map<string, number>> = new Map<Date, Map<string, number>>();
  filteredExpenses: Map<any, Map<string, number>> = new Map<any, Map<string, number>>();

  userId: number = Number(localStorage.getItem('userId'));
  userName: string = localStorage.getItem('userName') ?? 'Not found';
  selectedCurrencyIndex: number = 3;

  sortDesc = (a: any, b: any): number => {
    return parseInt(b.key) - parseInt(a.key);
  };

  constructor(
    public router: Router,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    public reloadService: ReloadService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (dbCategories) => {
        this.categories = dbCategories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
  });

  this.currencyService.getAllCurrencies().subscribe({
    next: (dbCurrencies) => {
      this.currencies = dbCurrencies;
      this.reloadService.setCurrentCurrency(this.currencies[3].code);
    },
    error: (error) => {
      console.error('Error fetching currencies:', error);
    }
  })

  this.reloadService.tabChange$.subscribe(tabName => {
    if (tabName) {
      this.filterExpenses(tabName);
    }
  });

  this.reloadService.reloadExpenses$.subscribe(() => {
    this.getExpensesBetweenDates(this.userId);
  });

  }

  onCurrencyChange(newCurrency: string): void {
    this.reloadService.setCurrentCurrency(newCurrency);
  }

  getExpensesBetweenDates(userId: number, startDate?: Date, endDate?: Date): void {
    this.expenseService.getExpensesByUserId(userId, startDate, endDate, this.reloadService.getCurrentCurrency())
              .subscribe(
                expenses => {
                  this.expenses = this.transformExpenses(expenses);
                  this.filterExpenses(this.reloadService.getCurrentTab());
              });

  }

  filterExpenses(period: string) {
    switch(period){
      case 'Day':
        this.filteredExpenses = this.groupExpensesByLastDays(this.expenses, 7);
        break;

      case 'Week':
        this.filteredExpenses = this.groupExpensesByWeek(this.expenses, 4);
        break;

      case 'Month':
        this.filteredExpenses = this.groupExpensesByMonth(this.expenses, 4);
        break;

      case 'Year':
       this.filteredExpenses = this.groupExpensesByYear(this.expenses, 4);
        break;

      case 'Custom':
        this.filteredExpenses = this.expenses;
        break;
    }
  }

  transformExpenses(expenses: Expense[]): Map<Date, Map<string, number>> {
    return expenses.reduce((acc, expense) => {
      const dateKey = expense.date;

      if (!acc.has(dateKey)) {
        acc.set(dateKey, new Map<string, number>());
      }

      const dateMap = acc.get(dateKey)!;
      const category = this.categories.find(c => c.id === expense.categoryId);
      if (category) {
        if(!dateMap.has(category.description)) {
        dateMap.set(category.description, 0);
        }

        dateMap.set(category.description, dateMap.get(category.description)! + expense.amount);
      }

      return acc;
    }, new Map<Date, Map<string, number>>());
  }

  groupExpensesByLastDays(expenses: Map<Date, Map<string, number>>, dayCount: number): Map<any, Map<string, number>> {
    let result = new Map<any, Map<string, number>>();

    let endDate = new Date();
    endDate.setHours(23, 59, 59);

    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - dayCount + 1);
    startDate.setHours(0, 0, 0);

    expenses.forEach((value, key) => {
      key = new Date(key);
      if(key.getTime() >= startDate.getTime() && key.getTime() <= endDate.getTime()){
        result.set(key.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: '2-digit' }), value);
      }
    });

    return result;
  }

  groupExpensesByWeek(expenses: Map<Date, Map<string, number>>, weekCount: number): Map<any, Map<string, number>> {
      let result = new Map<any, Map<string, number>>();

      const currentDate = new Date();

      let startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

      let endDate = new Date(startOfWeek);
      endDate.setDate(endDate.getDate() - 1);

      const thisWeek = this.processExpenses(expenses, startOfWeek, currentDate);
      if(thisWeek.size > 0)
        result.set('This week', thisWeek);

      for(let i = 0; i < weekCount; i++) {
        const currentWeekKey = `Last ${i > 0 ? i+1 : ''} week${i > 0 ? 's' : ''}`;
        endDate.setHours(23, 59, 59);

        let startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        startDate.setHours(0, 0, 0);

        const currentWeek = this.processExpenses(expenses, startDate, endDate);
        if(currentWeek.size > 0)
          result.set(currentWeekKey, currentWeek);

        endDate.setDate(startDate.getDate() - 1);
      }

    return result;
  }

  groupExpensesByMonth(expenses: Map<Date, Map<string, number>>, monthCount: number): Map<any, Map<string, number>> {
    let result = new Map<any, Map<string, number>>();

    const currentDate = new Date();
    let startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    let endDate = new Date(startOfMonth);
    endDate.setDate(endDate.getDate() - 1);

    const thisMonth = this.processExpenses(expenses, startOfMonth, currentDate);
    if(thisMonth.size > 0)
      result.set('This month', thisMonth);

    for(let i = 0; i < monthCount; i++){
      const currentMonthKey = endDate.toLocaleString('default', { month: 'long' });
      endDate.setHours(23, 59, 59);

      let startDate = new Date(endDate);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0);

      const currentMonth = this.processExpenses(expenses, startDate, endDate);
      if(currentMonth.size > 0)
        result.set(currentMonthKey, currentMonth);

      endDate.setDate(0);
    }

    return result;
  }

  groupExpensesByYear(expenses: Map<Date, Map<string, number>>, yearCount: number): Map<any, Map<string, number>> {
    let result = new Map<any, Map<string, number>>();

    const currentDate = new Date();
    let startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    let endDate = new Date(startOfYear);
    endDate.setDate(endDate.getDate() - 1);

    const thisYear = this.processExpenses(expenses, startOfYear, currentDate);
    if(thisYear.size > 0)
      result.set(currentDate.getFullYear(), thisYear);

    for(let i = 0; i < yearCount; i++){
      const currentYearKey = endDate.getFullYear();
      endDate.setHours(23, 59, 59);

      let startDate = new Date(endDate);
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0);

      const currentYear = this.processExpenses(expenses, startDate, endDate);
      if(currentYear.size > 0)
        result.set(currentYearKey, currentYear);
      endDate.setFullYear(endDate.getFullYear() - 1);
    }

    return result;
  }

  processExpenses(expenses: Map<Date, Map<string, number>>, startDate: Date, endDate: Date): Map<string, number> {
    let result = new Map<string, number>();

    for(let [date, details] of expenses){
      const dateObj = new Date(date);
      if (dateObj.getTime() >= startDate.getTime() && dateObj.getTime() <= endDate.getTime()) {
        for(let [category, amount] of details){
          if(!result.has(category)){
            result.set(category, 0);
          }
          result.set(category, Number((result.get(category)! + amount).toPrecision(3)));
        }
      }
    }

    return result;
  }
}


