import { Component, Input, OnInit } from '@angular/core';
import { Expense, Category, Currency } from '../models';
import { ExpenseService } from '../services/expense-service/expense.service';
import { CategoryService } from '../services/category-service/category.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { FormControl } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent, MatDateRangePicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import * as _moment from 'moment';
import { Moment } from 'moment';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { Sort } from '@angular/material/sort';
import { ReloadService } from '../services/reload-service/reload.service';

import {Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';

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
  selector: 'app-expense-table',
  templateUrl: './expense-table.component.html',
  styleUrls: ['./expense-table.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: SevenDayRangeSelectionStrategy,
    },
  ],
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

  date = new FormControl(_moment());

  private _selectedTab = ''; 

  startDate!: Date;
  endDate!: Date;
  currentDate: Date = new Date;
  weekMaxDate: Date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() + 3, 23, 59, 59);

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

  onTabChange() {
    const momentDate = this.date.value;
    switch (this._selectedTab) {
      case 'Day':
        this.startDate = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 0, 0, 0);
        this.endDate = new Date(momentDate.year(), momentDate.month(), momentDate.date(), 23, 59, 59);
        break;

      case 'Week':
        this.startDate = new Date(momentDate.year(), momentDate.month(), momentDate.date() - 3, 0, 0, 0);
        this.endDate = new Date(momentDate.year(), momentDate.month(), momentDate.date() + 3, 23, 59, 59);
        break;

      case 'Month':
        this.startDate = new Date(momentDate.year(), momentDate.month(), 1, 0, 0, 0);
        const nextMonth = this.startDate.getMonth() + 1;
        const nextYear = nextMonth === 12 ? this.startDate.getFullYear() + 1 : this.startDate.getFullYear();
        const firstDayOfNextMonth = new Date(nextYear, nextMonth % 12, 1);
        const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
        this.endDate = new Date(momentDate.year(), momentDate.month(), lastDayOfMonth.getDate(), 23, 59, 59);
        break;

      case 'Year':
        this.startDate = new Date(momentDate.year(), 0, 1, 0, 0, 0);
        this.endDate = new Date(momentDate.year(), 11, 31, 23, 59, 59);
        break;
    }
  }

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private reloadService: ReloadService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.userId=localStorage.getItem("userId") as string;
    this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});

    this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
    .subscribe({
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

  setDay(event: MatDatepickerInputEvent<Date>, datepicker: MatDatepicker<Moment>) {
    this.currentPage = 1;
    const selectedDate = _moment(event.value);
    this.date.setValue(selectedDate);
    this.updateTable("day");

    datepicker.close();
  }

  setWeek(event: MatDatepickerInputEvent<Date>): void {
    const ctrlValue = this.date.value.clone() as Moment;

    const selectedDate = _moment(event.value); 

    if (ctrlValue) {
        const updatedDate = ctrlValue
            .year(selectedDate.year())
            .month(selectedDate.month())
            .date(selectedDate.date() + 3); 

        // Actualizăm valoarea datei
        this.date.setValue(updatedDate);

        this.updateTable("week");
    }
  }

  setMonthAndYear(normalizedMonthAndYear: Date, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value.clone() as Moment;
    const newMonthAndYear = _moment(normalizedMonthAndYear);

    if (ctrlValue) {
      this.currentPage = 1;
      const updatedDate = ctrlValue.year(newMonthAndYear.year()).month(newMonthAndYear.month());
      this.date.setValue(updatedDate);
      this.updateTable("month");

      datepicker.close();
    }
  }

  setYear(normalizedYear: Date, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value.clone() as Moment;
    const newYear = _moment(normalizedYear);

    if (ctrlValue) {
      this.currentPage = 1;
      const updatedDate = ctrlValue.year(newYear.year());
      this.date.setValue(updatedDate);
      this.updateTable("year");

      datepicker.close();
    }
  }

  updateTable(selectedTime: string) {
    if (selectedTime == "week"){
      this.startDate.setFullYear(this.date.value.year(), this.date.value.month(), this.date.value.date()-3);
      this.endDate.setFullYear(this.date.value.year(), this.date.value.month(), this.date.value.date()+3);
    }
    else{

      this.startDate.setFullYear(this.date.value.year());
      this.endDate.setFullYear(this.date.value.year());
      if (selectedTime == "month" || selectedTime == "day") {
        this.startDate.setMonth(this.date.value.month());
        this.endDate.setDate(1);
        this.endDate.setMonth(this.date.value.month());

        if (selectedTime == "day") {
          this.startDate.setDate(this.date.value.date());
          this.endDate.setDate(this.date.value.date());
        }
        else {
          const nextMonth = this.startDate.getMonth() + 1;
          const nextYear = nextMonth === 12 ? this.startDate.getFullYear() + 1 : this.startDate.getFullYear();
          const firstDayOfNextMonth = new Date(nextYear, nextMonth % 12, 1);
          const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
          this.endDate.setDate(lastDayOfMonth.getDate());
        }
      }
    }

      this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});

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

  displayDay(): string {
    const selectedDate = this.date.value;
    return selectedDate ? selectedDate.format('DD MMMM YYYY') : 'Select Day';
  }

  displayWeek(): string {
    if (!this.startDate || !this.endDate) {
      return 'Select Week';
    }
  
    // Formatăm startDate și endDate
    const formattedStart = moment(this.startDate).format('DD MMMM YYYY');
    const formattedEnd = moment(this.endDate).format('DD MMMM YYYY');
  
    return `${formattedStart} - ${formattedEnd}`;
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
    this.currentPage = 1;
    this.date.value.subtract(1, 'day');
    this.updateTable("day");
  }

  goToNextDay(): void{
    this.currentPage = 1;
    this.date.value.add(1, 'day');
    this.updateTable("day");
  }

  goToPreviousWeek(): void{
    this.currentPage = 1;
    this.date.value.subtract(7, 'days');
    this.updateTable("week");
  }

  goToNextWeek(): void{
    this.currentPage = 1;
    this.date.value.add(7, 'days');
    this.updateTable("week");
  }

  goToPreviousMonth(): void{
    this.currentPage = 1;
    this.date.value.subtract(1, 'month');
    this.updateTable("month");
  }

  goToNextMonth(): void{
    this.currentPage = 1;
    this.date.value.add(1, 'month');
    this.updateTable("month");
  }

  goToPreviousYear(): void{
    this.currentPage = 1;
    this.date.value.subtract(1, 'year');
    this.updateTable("year");
  }

  goToNextYear(): void{
    this.currentPage = 1;
    this.date.value.add(1, 'year');
    this.updateTable("year");
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
              this.reloadService.reloadComponents();
              this.reloadService.reloadExpenses();
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
              this.reloadService.reloadComponents();
              this.reloadService.reloadExpenses();
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

  filterByCurrency(filter:Currency){
    this.currencyId=filter.id;
    this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});

      this.currentPage = 1;

    this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
    .subscribe((data: any) => {
      this.expenses = data;
    });
  }

  filterByCategory(filter:Category){
    this.categoryId=filter.id;

    this.expenseService.countPages(this.userId, this.startDate, this.endDate, this.pageSize, this.categoryId, this.currencyId)
    .subscribe({
      next: (response) => {
        this.maxPages = response;
      }});
      
    this.currentPage = 1

    this.expenseService.getExpensesPage(this.userId, this.startDate, this.endDate, this.currentPage, this.pageSize, this.sortBy, this.ascending, this.categoryId, this.currencyId)
    .subscribe((data: any) => {
      this.expenses = data;
    });
  }

  disableButton(): boolean{
    if (this.selectedTab==="Year" && this.date.value.year()==this.currentDate.getFullYear())
      return true;
    if (this.selectedTab==="Month" && this.date.value.year()==this.currentDate.getFullYear() && this.date.value.month()==this.currentDate.getMonth())
      return true;
    if (this.selectedTab === "Week" && this.endDate >= this.currentDate)
      return true;
    if (this.selectedTab==="Day" && this.date.value.year()==this.currentDate.getFullYear() && this.date.value.month()==this.currentDate.getMonth() && this.date.value.date()==this.currentDate.getDate())
      return true;
    return false;
  }
}
