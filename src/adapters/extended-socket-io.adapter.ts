import * as https from 'https';
import * as io from 'socket.io';

import { IoAdapter } from '@nestjs/platform-socket.io';

export class ExtendedSocketIoAdapter extends IoAdapter {
  protected ioServer: io.Server;

  constructor(protected server: https.Server) {
    super();

    const options = {
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };

    this.ioServer = new io.Server(server, options);
  }

  override create(_port: number) {
    console.log(
      'websocket gateway port argument is ignored by ExtendedSocketIoAdapter, use the same port of http instead',
    );
    return this.ioServer;
  }
}
