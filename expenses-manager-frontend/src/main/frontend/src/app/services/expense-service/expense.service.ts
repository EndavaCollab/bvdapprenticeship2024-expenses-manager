import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient) { }

  public createExpense(expense: any){
    return this.http.post(`${this.apiUrl}/expense`, expense);
  }
}
