import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  name: string='';
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  loginUser() {
    this.userService.login(this.name).subscribe({
      next: (response) => {
          this.router.navigate(['/']); 
      }, error: (error) => {
        console.error('Eroare la autentificare:', error);
      }
    });
  }
}
