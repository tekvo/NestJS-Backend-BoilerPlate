import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FailedLoginAttemptService } from './failed-login-attempt.service';
import { CreateFailedLoginAttemptDto } from './dto/create-failed-login-attempt.dto';
import { UpdateFailedLoginAttemptDto } from './dto/update-failed-login-attempt.dto';

@Controller('failed-login-attempt')
export class FailedLoginAttemptController {
  constructor(private readonly failedLoginAttemptService: FailedLoginAttemptService) {}

  @Post()
  create(@Body() createFailedLoginAttemptDto: CreateFailedLoginAttemptDto) {
    return this.failedLoginAttemptService.create(createFailedLoginAttemptDto);
  }

  @Get()
  findAll() {
    return this.failedLoginAttemptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.failedLoginAttemptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFailedLoginAttemptDto: UpdateFailedLoginAttemptDto) {
    return this.failedLoginAttemptService.update(+id, updateFailedLoginAttemptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.failedLoginAttemptService.remove(+id);
  }
}
