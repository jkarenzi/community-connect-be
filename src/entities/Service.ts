import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import User from './User';
import { Review } from './Review';

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type!: string;

    @Column()
    location!: string;

    @Column('boolean', { default: true })
    availability!: boolean;

    @Column('int')
    pricing!: number;

    @Column()
    name!: string;

    @Column('text')
    description!: string;

    @Column('text',{nullable:true})
    image!: string;

    @Column('float', {default: 0})
    avgRating!: number

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.services, { onDelete: 'CASCADE' }) 
    serviceProvider!: User;

    @OneToMany(() => Review, (review) => review.service)
    reviews!: Review[]
}
