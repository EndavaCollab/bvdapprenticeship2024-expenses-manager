import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/models';
import { LocalService } from '../local-service/local.service';
import { map } from 'rxjs';

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

  public login(name: string) {
    return this.http.post<any>(`${this.apiUrl}/users/login?name=${name}`, name)
          .pipe(
            map(response => {
              localStorage.setItem("userId", response.id);
              localStorage.setItem("userName", response.name);
            }));
          }
}
