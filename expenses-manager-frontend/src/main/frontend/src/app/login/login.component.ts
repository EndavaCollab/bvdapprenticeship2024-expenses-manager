import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service/user.service';
import { Router } from '@angular/router';
import { LocalService } from '../services/local-service/local.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  name: string='';
  submitted: boolean = false;
  constructor(private userService: UserService, 
    private localService: LocalService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  isInvalidUsername(name: string | null): boolean {
    return name !== null && name.trim().length === 0;
  }

  loginUser() {
    this.submitted=true;
    this.userService.login(this.name).subscribe({
      next: (response) => {
        this.localService.saveData("name", this.name);
        this.router.navigate(['/home']); 
      }, error: (error) => {
      }
    });
  }
}
