import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseTasksService } from './database-tasks.service';

describe('DatabaseTasksService', () => {
  let service: DatabaseTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseTasksService],
    }).compile();

    service = module.get<DatabaseTasksService>(DatabaseTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
