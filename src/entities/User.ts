import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Service } from './Service';
import { Review } from './Review'; 
import { Chat } from './Chat';

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
    services!: Service[];

    @OneToMany(() => Review, (review) => review.user)
    reviews!: Review[]; 

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

     // Add a relationship for chats (user can be a sender or recipient)
     @OneToMany(() => Chat, (chat) => chat.sender)
     sentChats!: Chat[];
 
     @OneToMany(() => Chat, (chat) => chat.recipient)
     receivedChats!: Chat[];
    chats: any;
}
