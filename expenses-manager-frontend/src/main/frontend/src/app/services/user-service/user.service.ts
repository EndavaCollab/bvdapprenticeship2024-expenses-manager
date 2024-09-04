import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl= environment.baseUrl;
  constructor(private http: HttpClient) {
  }

  public login(name: string) {
    return this.http.post<any>(`${this.apiUrl}/users/login?name=${name}`, name)
          .pipe(
            map(response => {
              localStorage.setItem("userId", response.id);
            }));
  }
}
