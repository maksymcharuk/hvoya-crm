import { Component, HostListener } from '@angular/core';

import { WebsocketGatewayService } from '@shared/services/websocket-gateway.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class DashboardMainComponent {
  @HostListener('window:click', ['$event'])
  onWindowScroll() {
    console.log('Clicked');

    this.ws.sendMessage();
  }

  constructor(private ws: WebsocketGatewayService) {}
}
