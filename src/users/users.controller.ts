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

  @Get('/level2')
  async level2(@Query('username') username: string): Promise<string> {
    return this.usersService.level2(username);
  }
}
