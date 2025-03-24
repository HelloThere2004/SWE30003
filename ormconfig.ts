import { User } from "src/entities/user.entity"
import { Comment } from "src/entities/comment.entity"
import { Topic } from "src/entities/topic.entity";
import { DataSourceOptions } from "typeorm";

const config : DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER || 'hellothere',
    password: process.env.POSTGRES_PASSWORD || '123456',
    database: process.env.POSTGRES_DB || 'mydb',
    synchronize: true,
    entities: [User, Comment, Topic]
}

export default config;