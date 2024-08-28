import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient) {
  }
  public login(name: any){
    return this.http.post(`${this.apiUrl}users/login?name=${name}`, name);
  }
}
