import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    login!: string;

    @Column()
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
