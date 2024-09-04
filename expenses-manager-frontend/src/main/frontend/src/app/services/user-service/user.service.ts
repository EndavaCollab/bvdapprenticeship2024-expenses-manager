import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/models';
import { LocalService } from '../local-service/local.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl= environment.baseUrl;
  constructor(private localService: LocalService, private http: HttpClient) {
  }

  public getLoggedUser(): Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/users/by-name?name=${this.localService.getData("name")}`);
  }

  public login(name: any){
    return this.http.post(`${this.apiUrl}/users/login?name=${name}`, name);
  }
}
