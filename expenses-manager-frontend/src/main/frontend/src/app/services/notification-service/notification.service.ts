import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  type: 'success' | 'error';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  constructor() { }

  showSuccess(message: string){
    this.notificationSubject.next({ type: 'success', message });
    
  }

  showError(message: string){
    this.notificationSubject.next({ type: 'error', message });

  }
  
}
