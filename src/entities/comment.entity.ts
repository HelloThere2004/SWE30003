import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from "typeorm";
import { User } from "./user.entity";
import { Topic } from "./topic.entity";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 250, nullable: false })
    content: string;

    @ManyToOne(() => User, user => user.comments, { nullable: false, onDelete: 'CASCADE' }) // Fixed relationship options
    user: User;

    @ManyToOne(() => Topic, topic => topic.comments, { nullable: true, onDelete: 'CASCADE' }) // Fixed relationship options
    topic: Topic;
}