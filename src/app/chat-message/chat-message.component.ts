import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; //

import { PublicUser } from '../api/user-public.model';
import { ChatMessage } from '../api/chat-message.model';
import { ChatService } from '../api/chat-message.service';
import { API_URL } from '../api/api-url';
import { UserService } from '../api/user.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss'
})
export class ChatMessageComponent {
  loggedInUserId: number | null = null;
  isLoggedIn: boolean = false;

  apiUrl = API_URL.BASE_URL;

  users: PublicUser[] = [];
  selectedUser: PublicUser | null = null;
  messages: ChatMessage[] = [];
  newMessageContent: string = '';
  private shouldScroll = false;

  @ViewChild('bottom') bottomRef!: ElementRef;

  pollSubscription!: Subscription;

  constructor(
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserValue();
    this.loggedInUserId = currentUser?.id ?? null;
    this.isLoggedIn = !!currentUser;

    this.loadUsers();

    this.pollSubscription = interval(1000).subscribe(() => {
      if (this.selectedUser) {
        this.loadMessages();
      }
    });
  }

  ngOnDestroy() {
    this.pollSubscription?.unsubscribe();
  }

  loadUsers() {
    if(this.loggedInUserId) {
      this.chatService.getChatContacts(this.loggedInUserId).subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (err) => {
          console.error('Błąd przy pobieraniu użytkowników:', err);
        },
      });
    }
  }

  selectUser(user: PublicUser) {
    this.selectedUser = user;
    this.shouldScroll = true;
    this.loadMessages();
  }

  loadMessages() {
    if (!this.selectedUser) {
      this.messages = [];
      return;
    }
    if(this.loggedInUserId) {
      this.chatService.getMessagesBetweenUsers(this.loggedInUserId, this.selectedUser.id).subscribe({
        next: (msgs) => {
          this.messages = msgs;
          if (this.shouldScroll) {
            setTimeout(() => {
              this.scrollToBottom();
              this.shouldScroll = false; 
            }, 0);
          }
        },
        error: (err) => {
          console.error('Błąd przy pobieraniu wiadomości:', err);
        },
      });
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      this.bottomRef?.nativeElement?.scrollIntoView({ behavior: 'auto' }); 
    }, 0); 
  }

  sendMessage(): void {
    if (!this.selectedUser || !this.newMessageContent.trim() || this.loggedInUserId === null) return;

    const newMessage: ChatMessage = {
      sender: {
        id: this.loggedInUserId,
        username: '',
        avatarUrl: ''
      },
      recipient: {
        id: this.selectedUser.id,
        username: '',
        avatarUrl: ''
      },
      content: this.newMessageContent.trim(),
      date: new Date().toISOString(),
      seen: false,
      id: null
    };

    this.chatService.sendMessage(newMessage).subscribe(sent => {
      this.messages.push(sent);
      this.newMessageContent = '';
      this.scrollToBottom();

      this.users = [
        this.selectedUser!,
        ...this.users.filter(u => u.id !== this.selectedUser!.id)
      ];
    });
  }


}
