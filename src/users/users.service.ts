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
}
