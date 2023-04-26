import { Test, TestingModule } from '@nestjs/testing';
import { NotificationListenerService } from './notification-listener.service';

describe('NotificationListenerService', () => {
  let service: NotificationListenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationListenerService],
    }).compile();

    service = module.get<NotificationListenerService>(NotificationListenerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
