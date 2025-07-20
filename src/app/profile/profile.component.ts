import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'; 

import { UserService } from '../api/user.service';
import { User } from '../api/user.model';
import { PublicUser } from '../api/user-public.model'
import { API_URL } from '../api/api-url';
import { Figure } from '../api/figure.model';
import { FigureListService } from '../api/figure-list.service';
import { TranslationService } from '../services/translation.service';
import { NotificationService } from '../api/notification.service'
import { FriendshipsService } from '../api/friendships.service';
import { ChatService } from '../api/chat-message.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    RouterModule,
    MatIconModule 
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  apiUrl = API_URL.BASE_URL;
  translatedTexts: { [key: string]: string } = {};

  user: PublicUser  | null = null;
  stats = { liked: 0, wanted: 0, owned: 0 };

  activeItem: string = 'liked';
  figurineLists: { [key: string]: Figure[] } = {};

  loggedInUserId: number | null = null;
  isLoggedIn: boolean = false;

  isFriendRequestSent: boolean = false;
  isFriend = false;

  isTradeRequestSent: boolean = false;
  isTrade = false

  constructor(
    private route: ActivatedRoute,
    private figureListService: FigureListService,
    private userService: UserService,
    private translationService: TranslationService,
    private router: Router,
    private notificationService: NotificationService,
    private friendshipService: FriendshipsService,
    private chatService: ChatService,
  ) {}

  ngOnInit(): void {
    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations['profile_page'] || {};
    });

    const shareId = this.route.snapshot.paramMap.get('shareId');
    if (!shareId) return;

    const currentUser = this.userService.getCurrentUserValue();
    this.loggedInUserId = currentUser?.id ?? null;
    this.isLoggedIn = !!currentUser;

    this.userService.getUserByShareId(shareId).subscribe({
      next: user => {
        if (!user || !user.id) {
          console.warn('User doesn\'t exist');
          return;
        }

        this.user = user;
        if (this.loggedInUserId !== null && this.user?.id !== undefined) {
          this.friendshipService.checkFriendship(this.loggedInUserId, this.user.id).subscribe(result => {
            this.isFriend = result;
          });
        }

        this.userService.getUserStats(user.id).subscribe(stats => {
          this.stats = {
            liked: stats["LIKED"] || 0,
            wanted: stats["WANTED"] || 0,
            owned: stats["OWNED"] || 0
          };
        });

        this.loadUserFigurineLists();
        this.checkFriendRequestStatus();
      },
      error: err => {
        if (err.status === 404) {
          this.router.navigate(['/404']);
        } else {
          console.error('Error: ', err);
        }
      }
    });
  }

  // getShareableLink(): string {
  //   if (!this.user) return '';
  //   const shareId = this.userService.generateHashedShareId(this.user.id);
  //   return `${window.location.origin}/profile/${shareId}`;
  // }

  addFriend(): void {
    if (this.user?.id) {
      const payload = {
        senderId: this.loggedInUserId,
        recipientId: this.user.id,
      };

      this.notificationService.sendFriendRequest(payload).subscribe({
        next: (res) => {
          this.checkFriendRequestStatus();
        },
        error: (err) => console.error('Error:', err),
      });
    }
  }

  removeFriend(): void {
    if (this.user?.id) {
      const payload = {
        userId1: this.loggedInUserId as number,
        userId2: this.user.id
      };
    
      this.friendshipService.removeFriend(payload).subscribe({
        next: response => {
          this.isFriend = false;
        },
        error: err => {
          console.error('Error removing friend:', err);
        }
      });
    }
  }

  checkFriendRequestStatus(): void {
    if (this.user && this.loggedInUserId) {
      this.notificationService
        .isFriendRequestSent(this.loggedInUserId, this.user.id)
        .subscribe((sent: boolean) => {
          this.isFriendRequestSent = sent;
        });
    }
  }

  cancelFriendRequest(): void {
    if (this.user?.id) {
      const payload = {
        senderId: this.loggedInUserId!,
        recipientId: this.user.id
      };

      this.notificationService.cancelFriendRequest(payload).subscribe({
        next: res => {
          this.checkFriendRequestStatus();
        },
        error: err => console.error('Error on cancellation:', err)
      });
    }
  }

  openChatWith(user: PublicUser): void {
    this.chatService.setSelectedUser(user);
    this.router.navigate(['/message']);
  }

  proposeTrade(): void {
    console.log("Propzycja wymiany");
  }

  cancelTradeRequest(): void {
    console.log("Anulowanie wymiany");
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  getActiveFigurines(): Figure[] {
    return this.figurineLists[this.activeItem] || [];
  }

  getListNames(): string[] {
    const fixedLists = ['liked', 'wanted', 'owned'];
    const allLists = Object.keys(this.figurineLists);
  
    const customLists = allLists.filter(list => !fixedLists.includes(list));
  
    return [...fixedLists, ...customLists]; 
  }
  
  formatListName(name: string): string {
    const formatted = name.replace(/_/g, ' ').toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  loadUserFigurineLists(): void {
    if (this.user && this.user.id) {
      this.figureListService.getUserFigurineLists(this.user.id).subscribe(lists => {
        this.figurineLists = Object.fromEntries(
          Object.entries(lists)
            .map(([key, figures]) => [key, figures.filter(f => f !== null)])
        );
      });
    };
  }
}
