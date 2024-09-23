import { Injectable } from '@angular/core';
import { LocalService } from '../local-service/local.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private localService: LocalService, private router: Router) { }

  notLoggedIn(){
    if (!this.localService.getData("name") && this.router.url!='/login')
      this.router.navigate(['/login']); 
  }
}
