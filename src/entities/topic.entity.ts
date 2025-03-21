import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Comment } from "./comment.entity";

@Entity()
export class Topic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 250, nullable: false })
    title: string;

    @Column({ length: 250, nullable: false })
    description: string;

    @OneToMany(() => Comment, comment => comment.topic) // Fixed relationship reference
    comments: Comment[];
}