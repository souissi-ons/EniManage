import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, finalize, of, Subscription } from 'rxjs';
import * as SockJS from 'sockjs-client';

interface ChatMessage {
  id?: number;
  sender: string;
  content: string;
  userId: number;
  timestamp: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  messages: ChatMessage[] = [];
  message: string = '';
  currentUserId: number = -1;
  currentUsername: string = '';
  isConnected: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;

  private ws: WebSocket | null = null;
  private subscriptions: Subscription[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 3000; // 3 seconds
  private token: string | null = null; // Stockage du token JWT

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Récupérer le token JWT du localStorage
    this.token = localStorage.getItem('token');
    this.loadUserData();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.closeWebSocketConnection();
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private loadUserData(): void {
    this.isLoading = true;
    this.error = null;

    // Ajoutez l'en-tête d'autorisation avec le token JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const sub = this.http
      .get<{ id: number; name: string }>('http://localhost:8081/api/auth/me', {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Failed to load user data:', error);
          this.error = 'Impossible de charger les données utilisateur';
          return of({ id: -1, name: 'Anonymous' });
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((user) => {
        this.currentUserId = user.id;
        this.currentUsername = user.name;
        this.loadMessages();
        this.connectWebSocket();
      });

    this.subscriptions.push(sub);
  }

  private loadMessages(): void {
    this.isLoading = true;

    // Ajoutez l'en-tête d'autorisation avec le token JWT
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });

    const sub = this.http
      .get<ChatMessage[]>('http://localhost:8081/api/messages', { headers })
      .pipe(
        catchError((error) => {
          console.error('Failed to load messages:', error);
          this.error = 'Impossible de charger les messages';
          return of([]);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((messages) => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      });

    this.subscriptions.push(sub);
  }

  private connectWebSocket(): void {
    if (this.ws) {
      this.closeWebSocketConnection();
    }

    try {
      // Option 1: Utiliser WebSocket natif avec token dans l'URL
      this.ws = new WebSocket(
        `ws://localhost:8081/ws/chat?token=${this.token}`
      );

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.error = null;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);

          // Check if this is an error message from server
          if (data.error) {
            console.error('Server error:', data.error);
            this.error = data.error;
            return;
          }

          // Check for duplicates before adding
          if (!this.isDuplicateMessage(data)) {
            this.messages.push(data);
            this.scrollToBottom();
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.error = 'Erreur de connexion WebSocket';
        this.isConnected = false;
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.isConnected = false;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.error = 'Impossible de créer la connexion WebSocket';
      this.isConnected = false;
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
      );

      setTimeout(() => {
        this.connectWebSocket();
      }, this.reconnectInterval);
    } else {
      this.error = 'Reconnexion impossible après plusieurs tentatives';
    }
  }

  private closeWebSocketConnection(): void {
    if (this.ws) {
      if (
        this.ws.readyState === WebSocket.OPEN ||
        this.ws.readyState === WebSocket.CONNECTING
      ) {
        this.ws.close();
      }
      this.ws = null;
    }
    this.isConnected = false;
  }

  private isDuplicateMessage(message: ChatMessage): boolean {
    return this.messages.some(
      (msg) =>
        (message.id && msg.id === message.id) ||
        (msg.content === message.content &&
          msg.sender === message.sender &&
          msg.timestamp === message.timestamp &&
          msg.userId === message.userId)
    );
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  sendMessage(): void {
    if (!this.message.trim()) {
      return;
    }

    // Don't send if not connected
    if (!this.isConnected) {
      this.error = 'Pas connecté au serveur. Tentative de reconnexion...';
      this.connectWebSocket();
      return;
    }

    const messageToSend: ChatMessage = {
      sender: this.currentUsername,
      content: this.message.trim(),
      userId: this.currentUserId,
      timestamp: new Date().toISOString(),
    };

    // Use WebSocket for sending
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(messageToSend));

      // Clear the input field immediately
      this.message = '';

      // Note: We no longer add the message directly to the array here
      // It will arrive via WebSocket, ensuring consistent display
    } else {
      console.error('WebSocket not open, attempting to reconnect...');
      this.error = "Erreur d'envoi: reconnexion en cours...";
      this.connectWebSocket();
    }
  }
}
