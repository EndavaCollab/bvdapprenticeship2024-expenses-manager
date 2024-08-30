import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  created: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl= environment.baseUrl;
  private name="";
  constructor(private http: HttpClient) {
  }
  public setName(name: string){
    this.name=name;
  }

  public getName(){
    return this.name;
  }

  public getLoggedUser(): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}users/name/${this.name}`);
  }

  public login(){
    return this.http.post(`${this.apiUrl}users/login?name=${this.name}`, this.name);
  }
}
