import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public getTotalAmountBetweenDates(userId: number, startDate?: Date, endDate?: Date){
    let params = new HttpParams()
                .set('userId', userId.toString())
                .set('startDate', this.datePipe.transform(startDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '')
                .set('endDate', this.datePipe.transform(endDate, 'yyyy-MM-dd\'T\'HH:mm:ss') ?? '');
  
    return this.http.get<number>(`${this.apiUrl}/expense/user/total`, {params});
  }
}