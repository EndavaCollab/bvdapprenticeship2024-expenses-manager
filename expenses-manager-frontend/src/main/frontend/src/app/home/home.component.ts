import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from '../services/expense-service/expense.service';
import { ReloadService } from '../services/reload-service/reload.service';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalAmount: number = 0;
  userId: number = Number(localStorage.getItem('userId'));

  constructor(
    private dialog: MatDialog, 
    private expenseService: ExpenseService,
    public reloadService: ReloadService ) { 
  }

  ngOnInit(): void {
    this.reloadService.tabChange$.subscribe(tabName => {
      if (tabName) {
        this.getTotalAmount(this.userId, tabName);
      }
    });
  }

  getTotalAmount(userId: number, period: string): void {
    const date = new Date();
    let startDate;
    let endDate;
    switch(period){
      case 'Day':
        startDate=new Date(date.getFullYear(), date.getMonth(), date.getDate());
        endDate=new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        break;
        
      case 'Week':
        startDate = new Date(date);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59);
        break;

      case 'Month':
        startDate=new Date(date.getFullYear(), date.getMonth(), 1);
        endDate=new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        break;

      case 'Year':
        startDate=new Date(date.getFullYear(), 0, 1);
        endDate=new Date(date.getFullYear(), 11, 31, 23, 59, 59);
        break;

      case 'Custom':
        break;
      }
      
    this.expenseService.getTotalAmountBetweenDates(userId, startDate,endDate, this.reloadService.getCurrentCurrency())
      .subscribe(amount => this.totalAmount = amount);
  }

  openDialog(): void{
    this.dialog.open(AddExpenseDialogComponent, {
      width: '45rem',
      data: {
        onExpenseAdded: () => {
          this.reloadService.reloadExpenses();
        }
      }
    });
  }
}
