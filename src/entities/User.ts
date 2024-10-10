import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import dotenv from 'dotenv'
import { Service } from './Service';
import { Review } from './Review';
dotenv.config()

export enum UserRole {
    CONSUMER = "consumer",
    SERVICE_PROVIDER = "serviceProvider"
}
  
@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole
    })
    role!: UserRole;

    @OneToMany(() => Service, (service) => service.serviceProvider)
    services!: Service[]

    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[]

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}