import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/level1')
  async level1(@Query('id') id: string): Promise<User[]> {
    return this.usersService.level1(id);
  }

  @Get('/level2')
  async level2(@Query('username') username: string): Promise<string> {
    return this.usersService.level2(username);
  }

  @Get('/level3')
  async level3(@Query('sort') sort: string) {
    if (!sort) {
      sort = 'id';
    }
    return this.usersService.level3(sort);
  }

  @Post('/level4/update-nickname')
  async level4UpdateRole(
    @Body('id') id: string,
    @Body('nickname') nickname: string,
  ) {
    return this.usersService.level4UpdateNickname(id, nickname);
  }

  @Get('/level4/find-peers')
  async level4(@Query('id') id: string) {
    return this.usersService.level4FindPeers(id);
  }
}
