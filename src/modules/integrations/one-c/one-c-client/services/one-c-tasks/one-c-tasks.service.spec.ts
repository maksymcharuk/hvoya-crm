import { Test, TestingModule } from '@nestjs/testing';

import { OneCTasksService } from './one-c-tasks.service';

describe('OneCTasksService', () => {
  let service: OneCTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OneCTasksService],
    }).compile();

    service = module.get<OneCTasksService>(OneCTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
