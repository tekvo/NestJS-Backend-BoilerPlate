import { Injectable } from '@nestjs/common';

@Injectable()
export class FailedLoginAttemptService {
  create(createFailedLoginAttemptDto: any) {
    return `This action adds a new failedLoginAttempt:${createFailedLoginAttemptDto}`;
  }

  findAll() {
    return `This action returns all failedLoginAttempt`;
  }

  findOne(id: string) {
    return `This action returns a #${id} failedLoginAttempt`;
  }

  update(id: string, updateFailedLoginAttemptDto: any) {
    return `This action updates a #${id} failedLoginAttempt,${updateFailedLoginAttemptDto}`;
  }

  remove(id: string) {
    return `This action removes a #${id} failedLoginAttempt`;
  }
}
