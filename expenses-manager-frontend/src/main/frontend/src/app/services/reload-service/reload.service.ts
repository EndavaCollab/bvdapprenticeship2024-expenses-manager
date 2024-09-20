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
  
  reloadExpenses() {
    this.reloadExpensesSource.next();
  }
  
  changeTab(tabName: string) {
    this.tabChangeSubject.next(tabName);
  }

  getCurrentTab(): string {
    return this.tabChangeSubject.getValue();
  }
}
