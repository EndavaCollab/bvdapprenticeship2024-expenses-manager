import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { Expense } from 'src/app/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl= environment.baseUrl;

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public createExpense(expense: any){
    return this.http.post(`${this.apiUrl}/expense`, expense);
  }

  public getExpensesByUserId(userId: any){
    return this.http.get<Expense[]>(`${this.apiUrl}/expense/user/${userId}`);
  }

  public getTotalAmountBetweenDates(userId: number, startDate?: Date, endDate?: Date){
    let params = new HttpParams()
                .set('userId', userId.toString())
                .set('startDate', this.datePipe.transform(startDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '')
                .set('endDate', this.datePipe.transform(endDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');
  
    return this.http.get<number>(`${this.apiUrl}/expense/user/total`, {params});
  }

  public updateExpense(expenseId: number, expenseData: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/expense/${expenseId}`, expenseData);
  }

  public deleteExpense(expenseId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/expense/${expenseId}`);
  }
  
  public getFilteredExpenses(userId: any, startDate?: Date, endDate?: Date)
  {
    let params = new HttpParams()
                .set('startDate', this.datePipe.transform(startDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '')
                .set('endDate', this.datePipe.transform(endDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');

    return this.http.get<Expense[]>(`${this.apiUrl}/expense/user/${userId}`, {params})
  }
}
