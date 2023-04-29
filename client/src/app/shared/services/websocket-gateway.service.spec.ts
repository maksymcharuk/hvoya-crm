import { TestBed } from '@angular/core/testing';

import { WebsocketGatewayService } from './websocket-gateway.service';

describe('WebsocketGatewayService', () => {
  let service: WebsocketGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
