import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../services/category-service/category.service';
import { CurrencyService } from '../services/currency-service/currency.service';
import { UserService } from '../services/user-service/user.service';
import { ExpenseService } from '../services/expense-service/expense.service';
import { Category, Currency, Expense } from '../models';
import { NotificationService } from '../services/notification-service/notification.service';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent implements OnInit {
  expenseForm!: FormGroup;
  currentDate = new Date();
  submitted = false;
  isEditMode = false; // Variabilă pentru a determina modul de editare sau adăugare

  categories: Category[] = [];
  currencies: Currency[] = [];

  constructor(
    private userService: UserService,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<AddExpenseDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { expense?: Expense, onExpenseAdded?: () => void }
  ) {}

  ngOnInit(): void {

    this.isEditMode = !!this.data.expense;

    this.expenseForm = this.formBuilder.group({
      description: [this.data.expense ? this.data.expense.description : '', []],
      date: [this.data.expense ? new Date(this.data.expense.date).toISOString().substring(0, 10) : this.currentDate.toISOString().substring(0, 10), Validators.required],
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

  onSubmit(): void {
    this.submitted = true;

    if (this.expenseForm.valid) {
        this.expenseForm.patchValue({ date: this.expenseForm.get("date")?.value + "T00:00:00" });

        if (this.isEditMode) {
            this.dialogRef.close(this.expenseForm.value);
        } else {
            this.expenseService.createExpense(this.expenseForm.value).subscribe({
                next: () => {
                    this.data.onExpenseAdded?.();
                    this.dialogRef.close(this.expenseForm.value);
                    this.notificationService.showSuccess("Expense added successfully!");
                },
                error: () => {
                    this.notificationService.showError("Error creating expense!");
                }
            });
        }
    } else {
        this.notificationService.showError("Invalid form! Complete all required fields!");
    }
  }
}
