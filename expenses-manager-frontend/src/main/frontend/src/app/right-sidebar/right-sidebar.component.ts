import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
  days = [
    {
      date: '5 September 2023',
      items: [
        { icon: 'Car', category: 'Car', price: '$193.02' },
        { icon: 'Food & Restaurants', category: 'Food & Restaurants', price: '$200.82' },
        { icon: 'Subscriptions', category: 'Subscriptions', price: '$15.55' }
      ]
    },
    {
      date: '4 September 2023',
      items: [
        { icon: 'Car', category: 'Car', price: '$193.02' },
        { icon: 'Food & Restaurants', category: 'Food & Restaurants', price: '$200.82' },
        { icon: 'Subscriptions', category: 'Subscriptions', price: '$15.55' }
      ]
    },
    {
      date: '3 September 2023',
      items: [
        { icon: 'Car', category: 'Car', price: '$193.02' },
        { icon: 'Food & Restaurants', category: 'Food & Restaurants', price: '$200.82' },
        { icon: 'Subscriptions', category: 'Subscriptions', price: '$15.55' }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
  
}
