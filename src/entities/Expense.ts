import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';
import dotenv from 'dotenv'
import Category from './Category';
import User from './User';
dotenv.config()
  
@Entity()
export default class Expense {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    description!: string;

    @ManyToOne(() => Category, (category) => category.expenses)
    category!: Category

    @ManyToOne(() => User, (user) => user.expenses)
    user!: User

    @Column('int')
    amount!: number

    @Column('date')
    date!: Date

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}