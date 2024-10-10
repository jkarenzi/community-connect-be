import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Service } from './Service';
import User from './User';


@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('int')
    rating!: number;

    @Column('text')
    description!: string;

    @ManyToOne(() => User, (user) => user.reviews)
    user!: User;

    @ManyToOne(() => Service, (service) => service.reviews, { onDelete: 'CASCADE' })
    service!: Service;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
