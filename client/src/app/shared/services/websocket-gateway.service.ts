import { Socket, io } from 'socket.io-client';

import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';

import { TokenService } from './token.service';

@Injectable()
export class WebsocketGatewayService {
  private socket: Socket;

  constructor(public tokenService: TokenService) {
    // Create a WebSocket connection to the backend
    this.socket = io(environment.webSocketUrl, {
      withCredentials: true, // Enable sending cookies if required
      extraHeaders: {
        Authorization: `Bearer ${this.tokenService.getToken()}`, // Add any additional headers
      },
    });

    // Register event handlers for the WebSocket events
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('response', (message: string) => {
      console.log(`Received response from server: ${message}`);
    });
  }

  // Example method to send a message to the server
  sendMessage() {
    const message = 'Hello from the client!';
    this.socket.emit('notification', message);
  }
}
