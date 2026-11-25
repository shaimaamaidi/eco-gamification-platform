import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/services-custom/NotificationService/notification-service';
import { AuthService } from '../../services/services-custom/AuthService/auth-service';
import { TokenService } from '../../services/token/token.service';
import { NotificationDto } from '../../services/models/notification-dto';

@Component({
  selector: 'app-notification',
  standalone : true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification  implements OnInit, OnDestroy{
  private isAdmin : boolean =false;
  private idUser = 0 ;
  public showNotifications = false;
  public notifications :NotificationDto [] = [];
  public unreadCount = 0;
 
  private notificationsSub!: Subscription;

  constructor(private authService: AuthService,private tokenService : TokenService ,private notificationService: NotificationService) {}

  async ngOnInit() {
    this.isAdmin = (this.authService.getRole() == "ADMIN");
    this.idUser = this.tokenService.getUserId() ?? 0;
    if (this.isAdmin) {
      this.notificationService.loadAdminNotifications();
      this.notificationService.connectAdmin();
    } else {
      this.notificationService.loadClientNotifications(this.idUser);
      this.notificationService.connectClient(this.idUser.toString());
    }
    this.notificationsSub = this.notificationService.notifications$.subscribe(
      (notifs: NotificationDto[]) => {
        this.notifications = notifs;
        this.unreadCount = this.notifications.filter(n => !n.read).length;
      }
    );
  }

  ngOnDestroy() {
    if (this.notificationsSub) {
      this.notificationsSub.unsubscribe();
    }
    this.notificationService.disconnect();
  }

  public toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    
    if (!this.showNotifications && this.unreadCount > 0) {
      if (this.isAdmin) {
        this.notificationService.markAllAsRead();
      } else {
        this.notificationService.markAllClientNotifAsRead(this.idUser);
      }
    }
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.unreadCount = 0;
    this.showNotifications = false;

    if (this.isAdmin) {
      this.notificationService.markAllAsRead();
    } else {
      this.notificationService.markAllClientNotifAsRead(this.idUser);
    }
  }
}
