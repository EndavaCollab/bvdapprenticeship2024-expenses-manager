import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  private tabChangeSubject = new BehaviorSubject<string>('');
  tabChange$ = this.tabChangeSubject.asObservable();

  private reloadExpensesSource = new Subject<void>();
  reloadExpenses$ = this.reloadExpensesSource.asObservable();

  private reloadTopbarSource = new Subject<void>();
  reloadTopbar$ = this.reloadTopbarSource.asObservable();
  
  private selectedCurrencySubject = new BehaviorSubject<string>('');
  selectedCurrency$ = this.selectedCurrencySubject.asObservable();
  
  reloadExpenses() {
    this.reloadExpensesSource.next();
  }

  reloadTopbar() {
    this.reloadTopbarSource.next();
  }
  
  changeTab(tabName: string) {
    this.tabChangeSubject.next(tabName);
  }

  getCurrentTab(): string {
    return this.tabChangeSubject.getValue();
  }

  changeCurrency(currency: string) {
    this.selectedCurrencySubject.next(currency);
  }

  getCurrentCurrency(): string {
    return this.selectedCurrencySubject.getValue();
  }

  setCurrentCurrency(currency: string) {
    this.selectedCurrencySubject.next(currency);
    this.reloadExpenses();
  }
}