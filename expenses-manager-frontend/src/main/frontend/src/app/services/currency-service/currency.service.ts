import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Currency {
  id: number;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getAllCurrencies(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}currencies`)
  }

  public getSelectedCurrency(currency: string): Observable<Currency>{
    return this.http.get<Currency>(`${this.apiUrl}currencies/${currency}`);
  }
}
