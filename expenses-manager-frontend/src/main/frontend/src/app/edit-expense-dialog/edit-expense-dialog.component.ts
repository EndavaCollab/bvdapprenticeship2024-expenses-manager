import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../services/category-service/category.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { UserService } from '../services/user-service/user.service';
import { ExpenseService } from '../services/expense-service/expense.service';
import { Category, Currency, Expense } from '../models';

@Component({
  selector: 'app-edit-expense-dialog',
  templateUrl: './edit-expense-dialog.component.html',
  styleUrls: ['./edit-expense-dialog.component.scss']
})
export class EditExpenseDialogComponent implements OnInit {
  expenseForm!: FormGroup;
  submitted = false;
  categories: Category[] = [];
  currencies: Currency[] = [];
  currentDate: string = new Date().toISOString().substring(0, 10);

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private dialogRef: MatDialogRef<EditExpenseDialogComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { expense: Expense }
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.formBuilder.group({
      description: [this.data.expense ? this.data.expense.description : '', []], 
      date: [this.data.expense ? new Date(this.data.expense.date).toISOString().substring(0, 10) : this.currentDate, Validators.required],
      amount: [this.data.expense ? this.data.expense.amount : null, [Validators.required, Validators.min(0.01)]],
      categoryId: [this.data.expense ? this.data.expense.categoryId : null, Validators.required],
      currencyId: [this.data.expense ? this.data.expense.currencyId : null, Validators.required],
      userId: [null, Validators.required]
    });
  
    this.setUserID();
    this.fetchCategories();
    this.fetchCurrencies();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  private setUserID(): void {
    this.userService.getLoggedUser().subscribe({
      next: (user) => {
        this.expenseForm.patchValue({ userId: user.id });
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      }
    });
  }

  fetchCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (dbCategories) => {
        this.categories = dbCategories;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  fetchCurrencies() {
    this.currencyService.getAllCurrencies().subscribe({
      next: (dbCurrencies) => {
        this.currencies = dbCurrencies;
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
      }
    });
  }

  getCurrencyCode(): string | null {
    const selectedCurrencyId = this.expenseForm.get('currencyId')?.value;
    const currency = this.currencies.find(curr => curr.id === selectedCurrencyId);
    return currency ? currency.code : null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.expenseForm.valid) {
      this.expenseForm.patchValue({ date: this.expenseForm.get("date")?.value + "T00:00:00" });
      this.dialogRef.close(this.expenseForm.value); 
    } else {
      console.log("Validation errors");
    }
  }  
}
