import { Test, TestingModule } from '@nestjs/testing';
import { FailedLoginAttemptService } from './failed-login-attempt.service';

describe('FailedLoginAttemptService', () => {
  let service: FailedLoginAttemptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FailedLoginAttemptService],
    }).compile();

    service = module.get<FailedLoginAttemptService>(FailedLoginAttemptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
