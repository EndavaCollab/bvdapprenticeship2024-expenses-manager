import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  description: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient) { }

  public getAllCategories(): Observable<string[]>{
    return this.http.get<string[]>(`${this.apiUrl}categories`);
  }

  public getSelectedCategory(category: string): Observable<Category>{
    return this.http.get<Category>(`${this.apiUrl}categories/${category}`);
  }
}
