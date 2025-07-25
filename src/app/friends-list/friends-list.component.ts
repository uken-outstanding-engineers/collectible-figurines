import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { FriendshipsService } from '../api/friendships.service';
import { ChatService } from '../api/chat-message.service';
import { PublicUser } from '../api/user-public.model';
import { UserService } from '../api/user.service';
import { API_URL } from '../api/api-url';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-friends-list',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './friends-list.component.html',
  styleUrl: './friends-list.component.scss'
})
export class FriendsListComponent {
  apiUrl = API_URL.BASE_URL;

  friends: PublicUser[] = [];
  openedMenuUserId: number | null = null;

  loggedInUserId: number | null = null;

  friendToRemoveId: number | null = null;
  selectedFriendUsername: string | null = null;

  constructor(
    private friendshipService: FriendshipsService,
    private chatService: ChatService,
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackbarService,
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.getCurrentUserValue();
    this.loggedInUserId = currentUser?.id ?? null;

    this.loadFriends();
  }

  loadFriends(): void {
    if(this.loggedInUserId) {
      this.friendshipService.getFriends(this.loggedInUserId).subscribe({
        next: (friends) => {
          this.friends = friends;
        },
        error: (err) => {
          console.error('Błąd podczas ładowania znajomych:', err);
        }
      });
    }
  }

  openChat(friend: PublicUser): void {
    this.chatService.setSelectedUser(friend);
    this.router.navigate(['/message']);
  }

  toggleMenu(friend: PublicUser): void {
    this.openedMenuUserId = this.openedMenuUserId === friend.id ? null : friend.id;
  }

  askRemoveFriend(id: number, username: string) {
    this.friendToRemoveId = id;
    this.selectedFriendUsername = username;
  }

  cancelRemove() {
    this.friendToRemoveId = null;
    this.selectedFriendUsername = "";
  }

  confirmRemoveFriend() {
    if (this.friendToRemoveId === null) return;
    if (this.loggedInUserId === null) return;

    const payload = {
      userId1: this.loggedInUserId,
      userId2: this.friendToRemoveId
    };

    this.friendshipService.removeFriend(payload).subscribe({
      next: () => {
        this.loadFriends();
        this.friendToRemoveId = null;

        this.snackBarService.showSuccess(`${this.selectedFriendUsername} zniknął(-ęła) z Twojej półki znajomych.`);
      },
      error: err => {
        console.error('Błąd przy usuwaniu znajomego:', err);
        this.friendToRemoveId = null;

        this.snackBarService.showError("Nie udało się usunąć znajomego.");
      }
    });
  }

  getShareId(hash: number): string {
    return this.userService.generateHashedShareId(hash);
  }
}
