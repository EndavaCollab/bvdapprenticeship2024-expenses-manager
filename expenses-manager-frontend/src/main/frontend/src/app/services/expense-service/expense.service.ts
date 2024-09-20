import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { Expense } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl= environment.baseUrl;

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public createExpense(expense: any){
    return this.http.post(`${this.apiUrl}/expense`, expense);
  }

  public getExpensesPage(userId: any, startDate?: Date, endDate?: Date, page?:any, size?:any, sortBy?: any, ascending?: any, categoryFilter?:any, currencyFilter?:any){
    let params = new HttpParams();
    if (startDate)
      params = params.set('startDate', this.datePipe.transform(startDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');
    if (endDate)
      params = params.set('endDate', this.datePipe.transform(endDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');
    if (size)
      params = params.set('size', size);
    if (ascending!=undefined){
      params = params.set('sortBy', sortBy)
                     .set('ascending', ascending);
   }
   if(currencyFilter){
    params = params.set('currencyId', currencyFilter);
   }

   if(categoryFilter){
    params = params.set('categoryId', categoryFilter);
   }

   if(page){
    params = params.set('page', page-1);
   }
   return this.http.get<Expense[]>(`${this.apiUrl}/expense/user/${userId}/`, {params});
  }

  public countPages(userId: any, startDate?: Date, endDate?: Date, size?:any, categoryFilter?:any, currencyFilter?:any){
    let params = new HttpParams();
    params = params.set('userId', userId);
    if (startDate)
      params = params.set('startDate', this.datePipe.transform(startDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');
    if (endDate)
      params = params.set('endDate', this.datePipe.transform(endDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');
    if (size)
      params = params.set('size', size);
    if(currencyFilter){
      params = params.set('currencyId', currencyFilter);
     }
  
     if(categoryFilter){
      params = params.set('categoryId', categoryFilter);
     }
     return this.http.get<number>(`${this.apiUrl}/expense/user/pages`, {params});
  }

  public getTotalAmountBetweenDates(userId: number, startDate?: Date, endDate?: Date){
    let params = new HttpParams()
                .set('userId', userId.toString())
                .set('startDate', this.datePipe.transform(startDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '')
                .set('endDate', this.datePipe.transform(endDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');
  
    return this.http.get<number>(`${this.apiUrl}/expense/user/total`, {params});
  }
}
