import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ToastrService } from 'ngx-toastr';
import { NotificationDto } from '../../models/notification-dto';
import { ClientNotificationControllerService } from '../../services/client-notification-controller.service';
import { AdminNotificationControllerService } from '../../services/admin-notification-controller.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient!: Client;
  private notificationsSubject = new BehaviorSubject<NotificationDto[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private errorSubject = new Subject<string>();
  public errors$ = this.errorSubject.asObservable();

  constructor(
    private toastr: ToastrService,
    private clientNotifApi : ClientNotificationControllerService,
    private adminNotifApi : AdminNotificationControllerService
  ) { }

  private connect(endpoint: string) {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(() => socket);


    this.stompClient.onConnect = (frame) => {
      this.stompClient.subscribe(endpoint, message => {
        const notif: NotificationDto = JSON.parse(message.body);
        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([notif, ...current]);
      });
    };

    this.stompClient.onStompError = (frame) => {
      const errorMsg = 'Erreur de connexion aux notifications. Veuillez réessayer.';
      this.toastr.error(errorMsg, 'Notification');
      this.errorSubject.next(errorMsg);
    };

    // Reconnexion automatique en cas de coupure
    this.stompClient.reconnectDelay = 5000;

    this.stompClient.activate();
  }

  public connectClient(userId: string) {
    this.connect(`/user/${userId}/notifications`);
  }

  public connectAdmin() {
    this.connect(`/topic/admin`);
  }

  public loadClientNotifications(userId: number): void {
    this.clientNotifApi.getAll({ clientId: userId }).subscribe({
      next: (notifications) => this.notificationsSubject.next(notifications),
      error: () => this.toastr.error('Impossible de charger les notifications', 'Erreur')
    });
  }

  public markAllClientNotifAsRead(userId: number): void {
    this.clientNotifApi.markAllRead({ clientId: userId }).subscribe({
      next: () => {
        const updated = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(updated);
      },
      error: () => this.toastr.error('Impossible de marquer toutes comme lues', 'Erreur')
    });
  }

  public loadAdminNotifications(): void {
     this.adminNotifApi.getAllNotifications().subscribe({
      next: (notifications) => this.notificationsSubject.next(notifications),
      error: () => this.toastr.error('Impossible de charger les notifications', 'Erreur')
    });
  }
  
  public markAllAsRead(): void {
    this.adminNotifApi.markAllRead1().subscribe({
      next: () => {
        const updated = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
        this.notificationsSubject.next(updated);
      },
      error: () => this.toastr.error('Impossible de marquer toutes comme lues', 'Erreur')
    });
  }

  public disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
}
