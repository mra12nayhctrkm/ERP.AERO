import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.model';

@Entity()
export class UserRefreshToken {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    token!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @Column()
    userId!: number;

    @CreateDateColumn()
    createdAt!: Date;
}
