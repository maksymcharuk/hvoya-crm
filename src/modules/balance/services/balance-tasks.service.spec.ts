import { Test, TestingModule } from '@nestjs/testing';
import { BalanceTasksService } from './balance-tasks.service';

describe('BalanceTasksService', () => {
  let service: BalanceTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalanceTasksService],
    }).compile();

    service = module.get<BalanceTasksService>(BalanceTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
