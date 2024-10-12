import { DataSource } from "typeorm";
import User from "../entities/User";
import dotenv from 'dotenv'
import { Service } from "../entities/Service";
import { Review } from "../entities/Review";
dotenv.config()

const env = {
    host: process.env.DB_HOST as string,
    database: process.env.DB_DATABASE as string,
    port: process.env.DB_PORT ? parseInt(process.env.port as string) : 5432,
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.host,
    port: env.port,
    username: env.username,
    password: env.password,
    database: env.database,
    synchronize: true,
    logging: true,
    entities: [User, Service, Review],
    subscribers: [],
    migrations: [],
})