import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getAllCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }
}
