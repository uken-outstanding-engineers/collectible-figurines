import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

import { PublicUser } from '../api/user-public.model';
import { ChatMessage } from '../api/chat-message.model';
import { ChatService } from '../api/chat-message.service';
import { API_URL } from '../api/api-url';
import { UserService } from '../api/user.service';
import { FigureService } from '../api/figure.service';
import { Figure } from '../api/figure.model';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
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

  menuOpen: boolean = false;

  @ViewChild('bottom') bottomRef!: ElementRef;

  pollSubscription!: Subscription;

  figures: Figure[] = [];
  isTradeBoxOpen: boolean = false;
  selectedOfferFigureId: number | null = null;
  selectedRequestFigureId: number | null = null;
  offerFigures: Figure[] = [];
  requestFigures: Figure[] = [];

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private figureService: FigureService,
    private eRef: ElementRef
  ) {}

  ngOnInit() {
    const currentUser = this.userService.getCurrentUserValue();
    this.loggedInUserId = currentUser?.id ?? null;
    this.isLoggedIn = !!currentUser;

    this.loadUsers();

    const passedUser = this.chatService.getSelectedUser();
    if (passedUser) {
      this.selectUser(passedUser);
      this.chatService.clear();
    }

    this.pollSubscription = interval(1000).subscribe(() => {
      if (this.selectedUser) {
        this.loadMessages();
      }
    });

    this.figureService.getFigures().subscribe(figs => {
      this.figures = figs;
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
    const recipient = this.selectedUser ?? this.chatService.getSelectedUser();

  if (!recipient || !this.newMessageContent.trim() || this.loggedInUserId === null) return;

    const newMessage: ChatMessage = {
      sender: {
        id: this.loggedInUserId,
        username: '',
        avatarUrl: ''
      },
      recipient: {
        id: recipient.id,
        username: '',
        avatarUrl: ''
      },
      content: this.newMessageContent.trim(),
      date: new Date().toISOString(),
      seen: false,
      id: null
    };

    this.chatService.sendMessage(newMessage).subscribe(sent => {
      this.messages.push(newMessage);
      this.newMessageContent = '';
      this.scrollToBottom();

      this.users = [
        this.selectedUser!,
        ...this.users.filter(u => u.id !== this.selectedUser!.id)
      ];
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @ViewChild('menuWrapper') menuWrapperRef!: ElementRef;
  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: HTMLElement) {
    const clickedInsideMenu = this.menuWrapperRef?.nativeElement.contains(targetElement);
    if (!clickedInsideMenu) {
      this.menuOpen = false;
    }
  }

  openTradeBox() {
    this.isTradeBoxOpen = true;
  }

  closeTradeBox() {
    this.isTradeBoxOpen = false;
    this.selectedOfferFigureId = null;
    this.selectedRequestFigureId = null;
    this.offerFigures = [];
    this.requestFigures = [];
  }

  addOfferFigure() {
    if (!this.selectedOfferFigureId) return;

    const id = Number(this.selectedOfferFigureId);  
    const fig = this.figures.find(f => f.id === id);
    if (fig && !this.offerFigures.some(f => f.id === fig.id)) {
      this.offerFigures.push(fig);
    }
  }

  removeOfferFigure(fig: Figure) {
    this.offerFigures = this.offerFigures.filter(f => f.id !== fig.id);
  }

  addRequestFigure() {
    if (!this.selectedRequestFigureId) return;

    const id = Number(this.selectedRequestFigureId);  
    const fig = this.figures.find(f => f.id === id);
    if (fig && !this.requestFigures.some(f => f.id === fig.id)) {
      this.requestFigures.push(fig);
    }
  }

  removeRequestFigure(fig: Figure) {
    this.requestFigures = this.requestFigures.filter(f => f.id !== fig.id);
  }

  confirmTrade() {
    if (this.offerFigures.length === 0 || this.requestFigures.length === 0) {
      alert('Musisz wybrać co najmniej jedną figurkę do wymiany i odbioru!');
      return;
    }

    console.log('Propozycja wymiany wysłana:', {
      offer: this.offerFigures,
      request: this.requestFigures
    });

    console.log('Propozycja wymiany została wysłana!');

    this.closeTradeBox();
  }
}