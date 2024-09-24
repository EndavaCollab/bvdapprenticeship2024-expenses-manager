import { Component, OnInit } from '@angular/core';
import { LocalService } from '../services/local-service/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  constructor(private localService: LocalService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(){
    if (this.localService.getData("name"))
      this.localService.removeData("name");
    this.router.navigate(['/login']); 
  }

}
