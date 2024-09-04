import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from '../services/expense-service/expense.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopbarComponent implements OnInit {
  tabs = ['Day', 'Week', 'Month', 'Year', 'Custom'];
  totalAmount: number = 0;
  currency: string = "RON";
  userId: number = Number(localStorage.getItem('userId'));

  constructor(public router: Router, private dialog: MatDialog, private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.onTabChange(0);
  }

  getTotalAmount(userId: number, startDate?: Date, endDate?: Date): void {
    this.expenseService.getTotalAmountBetweenDates(userId, startDate, endDate)
              .subscribe(amount => this.totalAmount = amount);
  }

  onTabChange(index: number): void{
    const selectedTab = this.tabs[index];
    const date = new Date();
    let startOfWeek: Date;
    let endOfWeek: Date;

    switch(selectedTab){
      case 'Day':
        this.getTotalAmount(this.userId, new Date(date.getFullYear(), date.getMonth(), date.getDate()), new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));
        break;

      case 'Week':
        startOfWeek = new Date(date);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0);

        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59);

        this.getTotalAmount(this.userId, startOfWeek, endOfWeek);
        break;

      case 'Month':
        this.getTotalAmount(this.userId, new Date(date.getFullYear(), date.getMonth(), 1), new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59));
        break;

      case 'Year':
        this.getTotalAmount(this.userId, new Date(date.getFullYear(), 0, 1), new Date(date.getFullYear(), 11, 31, 23, 59, 59));
        break;
        
      case 'Custom':
        this.getTotalAmount(this.userId);
        break;
    }
  }

  openDialog(): void{
    this.dialog.open(AddExpenseDialogComponent, {
      width: '45rem',
    });
  }
}
