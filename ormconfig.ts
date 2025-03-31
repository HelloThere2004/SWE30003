import { User } from "src/entities/user.entity"
import { Ride } from "src/entities/ride.entity"
import { DataSourceOptions } from "typeorm";

const config: DataSourceOptions = {
    type: 'postgres',
    host: 'postgres', 
    port: 5432,
    username: 'hellothere',
    password: '123456',
    database: 'mydb',
    synchronize: true,
    entities: [User, Ride]
}

export default config;