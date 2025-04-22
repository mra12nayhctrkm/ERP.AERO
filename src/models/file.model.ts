import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    filename!: string;

    @Column()
    mimetype!: string;

    @Column()
    size!: number;

    @Column()
    extension!: string;

    @CreateDateColumn()
    uploadedAt!: Date;
}
