import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddExpenseDialogComponent>) { }

  ngOnInit(): void {
  }
  
  selectedCurrency="RON";
  categories: string[] = ["Food & Restaurants", "Car", "Subscriptions", "Entertainment", "Education", "Clothing", "Health"];
  currencies: string[] = ["RON", "Euro", "US Dolar"];

  closeDialog(): void{
    this.dialogRef.close();
  }

}
