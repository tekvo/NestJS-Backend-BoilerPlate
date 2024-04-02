import { Test, TestingModule } from '@nestjs/testing';
import { FailedLoginAttemptController } from './failed-login-attempt.controller';
import { FailedLoginAttemptService } from './failed-login-attempt.service';

describe('FailedLoginAttemptController', () => {
  let controller: FailedLoginAttemptController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FailedLoginAttemptController],
      providers: [FailedLoginAttemptService],
    }).compile();

    controller = module.get<FailedLoginAttemptController>(FailedLoginAttemptController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
