import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/level1')
  async findOne(@Query('id') id: string): Promise<User[]> {
    return this.usersService.level1(id);
  }
}
