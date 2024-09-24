import { Component, Input, OnInit } from '@angular/core';
import { Expense, Category, Currency } from '../models';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { EditExpenseDialogComponent } from '../edit-expense-dialog/edit-expense-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import * as _moment from 'moment';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';

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
  showActionsMap: { [key: number]: boolean } = {}; //submenu for actions

  currentPage: number = 1;
  maxPages: number = 10;

  date = new FormControl(_moment());

  @Input() selectedTab="";

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private dialog: MatDialog
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

  setDay(event: MatDatepickerInputEvent<Date>, datepicker: MatDatepicker<Moment>) {
    const selectedDate = _moment(event.value);
    this.date.setValue(selectedDate);
    datepicker.close();
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

  setYear(normalizedYear: Date, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value.clone() as Moment;
    const newYear = _moment(normalizedYear);
    
    if (ctrlValue) {
      const updatedDate = ctrlValue.year(newYear.year());
      this.date.setValue(updatedDate);
      
      datepicker.close();
    }
  }

  openDatepicker(datepicker: MatDatepicker<moment.Moment>) {
    datepicker.open();
  }

  displayDay(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('DD MMMM YYYY') : 'Select Day';
  }

  displayMonthAndYear(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('MMMM YYYY') : 'Select Month/Year';
  }

  displayYear(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('YYYY') : 'Select Year';
  }

  goToPreviousDay(): void{
    this.date.value.subtract(1, 'day');
  }

  goToNextDay(): void{
    this.date.value.add(1, 'day');
  }

  goToPreviousMonth(): void{
    this.date.value.subtract(1, 'month');
  }

  goToNextMonth(): void{
    this.date.value.add(1, 'month');
  }

  goToPreviousYear(): void{
    this.date.value.subtract(1, 'year');
  }

  goToNextYear(): void{
    this.date.value.add(1, 'year');
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

  openEditExpenseDialog(expense: Expense): void {
    const dialogRef = this.dialog.open(EditExpenseDialogComponent, {
      width: '400px',
      data: { expense }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        Object.assign(expense, result); // Update existing expense
        this.expenseService.updateExpense(expense.id, expense).subscribe({
          next: () => {
            this.fetchExpenses(); // Refresh the expenses list
          },
          error: (error) => {
            console.error('Error updating expense:', error);
          }
        });
      }
    });
  }
  
  fetchExpenses(): void {
    const userId = localStorage.getItem("userId");
    this.expenseService.getExpensesByUserId(userId).subscribe({
      next: (response) => {
        this.expenses = response; 
        this.showActionsMap = {}; 
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }
  
  
  confirmDelete(expense: Expense): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.deleteExpense(expense.id).subscribe({
          next: () => {
            this.fetchExpenses();
          },
          error: (error) => {
            console.error('Error deleting expense:', error);
          }
        });
      }
    });
  }

    toggleActions(expenseId: number): void {
      this.showActionsMap[expenseId] = !this.showActionsMap[expenseId];
    }
    
}
