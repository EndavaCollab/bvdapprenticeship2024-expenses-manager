import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  name='';
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  loginUser(){
    this.userService.login(`${this.name}`).subscribe(response => {
      console.log(response);
    })
  }
}
