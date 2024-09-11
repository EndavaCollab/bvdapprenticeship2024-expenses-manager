import { Component, OnInit } from '@angular/core';
import { Expense, Category, Currency } from '../models';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss']
})
export class ExpenseTableComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'date', 'amount', 'currency', 'category', 'description'];
  expenses: Expense[] = [];

  categories: Category[] = [];
  currencies: Currency[] = [];

  currentPage: number = 1;
  maxPages: number = 10;

  date = new FormControl(_moment());

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService
  ) { }

  ngOnInit(): void {
    this.expenseService.getExpensesByUserId(localStorage.getItem("userId")).subscribe({
      next: (response) => {
        this.expenses = response;
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });

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
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
      }
    });
  }

  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.maxPages) {
      this.currentPage = page;
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.maxPages) {
      this.currentPage++;
    }
  }

  getMiddlePages(): number[] {
    const pages: number[] = [];

    if (this.maxPages<=5)
      for (let i = 2; i <= this.maxPages; i++) {
        pages.push(i);
      }
    else
      if (this.currentPage<=2){
        for (let i = 2; i <= 3; i++) {
          pages.push(i);
        }
      }
      else if (this.currentPage>=this.maxPages-1){
        for (let i = this.maxPages-2; i <= this.maxPages-1; i++) {
          pages.push(i);
        }
      }
      else{
        for (let i = this.currentPage-1; i <= this.currentPage+1; i++) {
          pages.push(i);
        }
      }

    return pages;
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value.clone() as Moment;
    const newMonthAndYear = _moment(normalizedMonthAndYear);
    
    if (ctrlValue) {
      const updatedDate = ctrlValue.year(newMonthAndYear.year()).month(newMonthAndYear.month());
      this.date.setValue(updatedDate);
      
      datepicker.close();
    }
  }

  openDatepicker(datepicker: MatDatepicker<moment.Moment>) {
    datepicker.open();
  }

  displayMonthAndYear(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('MMMM YYYY') : 'Select Month/Year';
  }

  goToPreviousMonth(): void{
    this.date.value.subtract(1, 'month');
  }

  goToNextMonth(): void{
    this.date.value.add(1, 'month');
  }

  getCategoryDescription(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.description || 'Unknown';
  }

  getCategoryColor(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category?.color || '#000000';
  }

  getCurrencyCode(currencyId: number): string {
    const currency = this.currencies.find(curr => curr.id === currencyId);
    return currency?.code || 'N/A';
  }

  hexToRgba(hexColor: string): string {
    hexColor = hexColor.replace(/^#/, '');
    const red = parseInt(hexColor.substring(0, 2), 16);
    const green = parseInt(hexColor.substring(2, 4), 16);
    const blue = parseInt(hexColor.substring(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, 0.2)`;
  }
}
