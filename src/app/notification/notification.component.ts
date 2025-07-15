import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { API_URL } from '../api/api-url';
import { NotificationService } from '../api/notification.service';
import { Notification } from '../api/notification.model';
import { UserService } from '../api/user.service';
import { FriendshipsService } from '../api/friendships.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  apiUrl = API_URL.BASE_URL;

  notifications: Notification[] = [];

  loggedInUserId: number | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private friendshipsService: FriendshipsService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUserValue();
    this.loggedInUserId = currentUser?.id ?? null;
    this.isLoggedIn = !!currentUser;

    if (this.loggedInUserId !== null) {
      this.loadNotifications(this.loggedInUserId);
    }
  }

  loadNotifications(userId: number): void {
    this.notificationService.getNotificationsForUser(userId).subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (err) => {
        console.error('Błąd podczas pobierania powiadomień:', err);
      },
    });
  }

  acceptFriendRequest(notification: Notification): void {
    const payload = {
      userId1: this.loggedInUserId!,
      userId2: notification.sender.id
    };

    if (!this.loggedInUserId) {
      console.error('Brak zalogowanego użytkownika');
      return;
    }
    if (!notification?.sender?.id) {
      console.error('Brak ID nadawcy powiadomienia');
      return;
    }

    this.friendshipsService.acceptFriendRequest(payload).subscribe({
      next: (data) => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      },
      error: err => {
        console.error('Błąd przy potwierdzaniu znajomości:', err);
      }
    });
  }


  rejectFriendRequest(notification: Notification): void {
    if (this.loggedInUserId && notification.sender?.id) {
      const payload = {
        senderId: notification.sender.id,
        recipientId: this.loggedInUserId
      };

      this.notificationService.cancelFriendRequest(payload).subscribe({
        next: res => {
          this.notifications = this.notifications.filter(n => n.id !== notification.id);
        },
        error: err => console.error('Błąd przy anulowaniu:', err)
      });
    }  
  }

  // markAsSeen(notificationId: number): void {
  //   this.notificationService.markAsSeen(notificationId).subscribe({
  //     next: () => {
  //       const notification = this.notifications.find(n => n.id === notificationId);
  //       if (notification) {
  //         notification.seen = true;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Błąd przy oznaczaniu powiadomienia jako przeczytane:', err);
  //     }
  //   });
  // }
}
