import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-expense-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  selectedCurrency="RON";

  focusDateInput(){
    document.getElementById("dateInput")?.focus();
  }

  focusCurrencyInput(){
    document.getElementById("currencyInput")?.focus();
  }

  focusAmountInput(){
    document.getElementById("amountInput")?.focus();
  }

}
