import { User } from "src/entities/user.entity"
import { Comment } from "src/entities/comment.entity"
import { Topic } from "src/entities/topic.entity";
import { DataSourceOptions } from "typeorm";

const config : DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'hellothere',
    password: '123456',
    database: 'mydb',
    synchronize: true,
    entities: [User, Comment, Topic]
}

export default config;