import { Component, OnInit } from '@angular/core';
import { Notification, NotificationService } from '../services/notification-service/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.notification$.subscribe((notification: Notification) =>{
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications.shift();
      }, 5000);
    })
  }

  removeNotification(index: number) {
    this.notifications.splice(index, 1);
  }
}
