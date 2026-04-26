import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ROLE } from './entities/user.entity';
import { Repository } from 'typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const count = await this.usersRepository.count();
    if (count === 0) {
      console.log('Seeding database with initial users...');
      await this.usersRepository.save([
        {
          username: 'admin',
          password: 'SuperSecretAdminPassword123!',
          role: ROLE.ADMIN,
        },
        { username: 'john_doe', password: 'password123', role: ROLE.USER },
        { username: 'jane_smith', password: 'qwerty!@#', role: ROLE.USER },
      ]);
    }
  }

  async level1(id: string): Promise<User[]> {
    const query = `SELECT * FROM users WHERE id = ${id}`;
    try {
      const result: User[] = await this.dataSource.query(query);
      return result;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';
      throw new InternalServerErrorException(message);
    }
  }

  async level2(username: string): Promise<string> {
    const query = `SELECT * FROM users WHERE username='${username}'`;
    try {
      const rows: User[] = await this.dataSource.query(query);
      if (rows.length != 0) {
        return 'User exists in the system';
      }
      return 'User does not exist in the system';
    } catch {
      const message = 'An error occurred.';
      return message;
    }
  }

  async level3(sort: string): Promise<User[] | { message: string }> {
    const query = `SELECT id, username, role FROM users ORDER BY ${sort}`;

    try {
      const result: User[] = await this.dataSource.query(query);
      return result;
    } catch {
      return { message: 'Sort failed.' };
    }
  }

  async level4UpdateNickname(id: string, nickname: string) {
    try {
      await this.usersRepository.update(id, { nickname: nickname });
      return { message: `Nickname for user ${id} updated.` };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';
      throw new InternalServerErrorException(message);
    }
  }

  async level4FindPeers(id: string): Promise<User[] | { message: string }> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user || !user.nickname) return { message: 'User/Nickname not found.' };

    const query = `SELECT username, role, nickname FROM users WHERE nickname='${user.nickname}'`;

    try {
      return await this.dataSource.query(query);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown database error';
      return { message };
    }
  }
}
