import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../services/category-service/category.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user-service/user.service';
import { ExpenseService } from '../services/expense-service/expense.service';
import { Category, Currency } from '../models';
import { NotificationService } from '../services/notification-service/notification.service';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent implements OnInit {
  expenseForm!: FormGroup;
  currentDate = new Date;
  submitted=false;

  constructor( private userService: UserService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<AddExpenseDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  categories: Category[] = [];
  currencies: Currency[] = [];

  ngOnInit(): void {
    this.expenseForm=this.formBuilder.group({
      description: [''],
      date: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      categoryId: [null, Validators.required],
      currencyId: [null, Validators.required],
      userId:[null, Validators.required],
    })
    this.setUserID();

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

  private setUserID(): void {
    this.userService.getLoggedUser().subscribe({
      next: (user) => {
        this.expenseForm.patchValue({ userId: user.id }); // Setează userID în formular
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  getCurrencyCode(): string | null {
    const selectedCurrencyId = this.expenseForm.get('currencyId')?.value;
    const currency = this.currencies.find(curr => curr.id == selectedCurrencyId);
    return currency ? currency.code : null;
  }

  onSubmit(){
    this.submitted = true;
    if (this.expenseForm.valid){
      this.expenseForm.patchValue({date: this.expenseForm.get("date")?.value+"T00:00:00"});
      this.expenseService.createExpense(this.expenseForm.value).subscribe({
        next: (response) => {
          this.data.onExpenseAdded();
          this.dialogRef.close();
          this.notificationService.showSuccess("Expense added successfully!");
        },
        error: (error) => {
          this.notificationService.showError("Error creating expense!");
        }
      });
    }
    else{
      this.notificationService.showError("Invalid form! Complete all required fields!");
    }
  }
}
