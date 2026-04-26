import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: ROLE,
  })
  role!: ROLE;

  @Column({ nullable: true })
  nickname!: string;
}
