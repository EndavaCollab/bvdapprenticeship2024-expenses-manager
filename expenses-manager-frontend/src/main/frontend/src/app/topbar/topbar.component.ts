import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TopbarComponent implements OnInit {
  tabs = ['Day', 'Week', 'Month', 'Year', 'Custom'];
  data = 'No value';

  constructor() { }

  ngOnInit(): void {
    this.onTabChange(0);
  }

  onTabChange(index: number): void{
    const selectedTab = this.tabs[index];
    switch(selectedTab){
      case 'Day':
        this.data = '$100,02';
        break;
      case 'Week':
        this.data = '$216,56';
        break;
      case 'Month':
        this.data = '$1345,88';
        break;
      case 'Year':
        this.data = '$14500,00';
        break;
      case 'Custom':
        this.data = '$0';
        break;
    }
  }
}
