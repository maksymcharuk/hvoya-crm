import { TestBed } from '@angular/core/testing';

import { WebSocketGatewayService } from './websocket-gateway.service';

describe('WebSocketGatewayService', () => {
  let service: WebSocketGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
