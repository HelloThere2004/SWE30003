import { User } from "src/entities/user.entity"
import { Ride } from "src/entities/ride.entity"
import { DataSourceOptions } from "typeorm";

const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: 5432,
    username: process.env.POSTGRES_USER || 'hellothere',
    password: process.env.POSTGRES_PASSWORD || '123456',
    database: process.env.POSTGRES_DB || 'mydb',
    synchronize: true,
    entities: [User, Ride]
}

export default config;