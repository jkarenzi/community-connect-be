import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import User from './User';
import { Service } from './Service';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.sentChats)
    sender!: User;

    @ManyToOne(() => User, (user) => user.receivedChats)
    recipient!: User;

    @ManyToOne(() => Service, (service) => service.chats)
    service!: Service;

    @Column()
    message!: string;

    @CreateDateColumn()
    timestamp!: Date;
}

export default Chat;
