import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExpenseService } from '../services/expense-service/expense.service';
import { User, UserService } from '../services/user-service/user.service';
import { Category, CategoryService } from '../services/category-service/category.service';
import { firstValueFrom } from 'rxjs';
import { CurrencyService } from '../services/currency-service/currency.service';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent implements OnInit {

  constructor(private userService: UserService,
    private expenseService: ExpenseService, 
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private dialogRef: MatDialogRef<AddExpenseDialogComponent>,
  ) {}

  categories: string[] = [];
  currencies: string[] = [];

  selectedCurrency="";
  selectedCategory="";
  selectedDate="";
  selectedAmount=0;
  description="";

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (dbCategories) => {
        this.categories = dbCategories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    })
    
    this.currencyService.getAllCurrencies().subscribe({
      next: (dbCurrencies) => {
        this.currencies = dbCurrencies;
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
      }
    })
    
  }

  closeDialog(): void{
    this.dialogRef.close();
  }

  private expense = {
    description: this.description,
    date: this.selectedDate,
    amount: this.selectedAmount,
    categoryId: 0,
    currencyId: 0,
    userId:0 ,
  };

  private async setExpense(){
    this.expense.description=this.description;
    this.expense.date=this.selectedDate+"T00:00:00";
    this.expense.amount=this.selectedAmount;
    const category = await firstValueFrom(this.categoryService.getSelectedCategory(this.selectedCategory));
    this.expense.categoryId = category.id;
    const currency = await firstValueFrom(this.currencyService.getSelectedCurrency(this.selectedCurrency));
    this.expense.currencyId = currency.id;
    const user = await firstValueFrom(this.userService.getLoggedUser());
    this.expense.userId = user.id;
  }

  async log(){
    await this.setExpense();
    this.expenseService.createExpense(this.expense).subscribe({
      next: (response) => {
        this.dialogRef.close();
      }, error: (error) => {
        console.error('Eroare la crearea unui expense:', error);
      }
    });
  }
}
