import { Component, Input, OnInit } from '@angular/core';
import { Expense, Category, Currency } from '../models';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import * as _moment from 'moment';
import { Moment } from 'moment';
import * as moment from 'moment';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { Sort } from '@angular/material/sort';

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

  sortBy?: string;
  ascending?: boolean;
  currencyId?: number;
  categoryId?: number;
  currentPage: number = 1;
  pageSize: number=5;
  maxPages!: number;
  userId!:string;

  @Input() selectedTab="";
  startDate!:Date;
  endDate!:Date;

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userId=localStorage.getItem("userId") as string;
    
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
    this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});
    
    if (page !== this.currentPage && page >= 1 && page <= this.maxPages) {
      this.currentPage = page;

      this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
    .subscribe((data: any) => {
      this.expenses = data;
    });
    }
  }

  goToPreviousPage(): void {
    this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});

    if (this.currentPage > 1) {
      this.currentPage--;
      this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
    .subscribe((data: any) => {
      this.expenses = data;
    });
    }
  }

  goToNextPage(): void {
    this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});

    if (this.currentPage < this.maxPages) {
      this.currentPage++;
      this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
    .subscribe((data: any) => {
      this.expenses = data;
    });
    }
  }

  getMiddlePages(): number[] {
    const pages: number[] = [];

    if (this.maxPages <= 5)
      for (let i = 2; i <= this.maxPages; i++) {
        pages.push(i);
      }
    else
      if (this.currentPage <= 2) {
        for (let i = 2; i <= 3; i++) {
          pages.push(i);
        }
      }
      else if (this.currentPage >= this.maxPages - 1) {
        for (let i = this.maxPages - 2; i <= this.maxPages - 1; i++) {
          pages.push(i);
        }
      }
      else {
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
      }

    return pages;
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
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '400px',
      data: { expense } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (expense.id !== undefined) {
          Object.assign(expense, result); 

          this.expenseService.updateExpense(expense.id, expense).subscribe({
            next: () => {
              this.fetchExpenses(); // Refresh the expense list after update
            },
            error: (error) => {
              console.error('Error updating expense:', error); // Log if there's an error
            }
          });
        } else {
          console.error('Expense ID is undefined, cannot update.'); // Log if ID is missing
        }
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
        if (expense.id !== undefined) {
          this.expenseService.deleteExpense(expense.id).subscribe({
            next: () => {
              this.fetchExpenses();
            },
            error: (error) => {
              console.error('Error deleting expense:', error);
            }
          });
        } else {
          console.error('Expense ID is undefined, cannot delete.');
        }
      }
    });
  }
  
  toggleActions(expenseId: number): void {
    this.showActionsMap[expenseId] = !this.showActionsMap[expenseId];
  }
    
  sortData(sortState:Sort){
      this.sortBy=sortState.active.toUpperCase();
      this.ascending=sortState.direction === 'asc' ? true : (sortState.direction === 'desc' ? false : undefined);
      this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
      .subscribe((data: any) => {
        this.expenses = data;
      });
  }

  update() {
    this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});

    this.currentPage=1;

    this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.expenses = response;
      },
      error: (error) => {
        console.error('Error getting expenses:', error);
      }
    });
  }

  filterByCurrency(filter:Currency){
    this.currencyId=filter.id;
    this.update();
  }

  filterByCategory(filter:Category){
    this.categoryId=filter.id;

    this.update();
  }

}
