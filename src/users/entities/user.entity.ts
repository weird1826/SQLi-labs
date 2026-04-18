import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum ROLE {
    ADMIN = 'ADMIN',
    USER = 'USER'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: ROLE,
    })
    role: ROLE
}
