import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Currency } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getAllCurrencies(): Observable<Currency[]>{
    return this.http.get<Currency[]>(`${this.apiUrl}/currencies`)
  }
}
