import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import dotenv from 'dotenv'
import Category from './Category';
import Expense from './Expense';
dotenv.config()
  
@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => Category, (category) => category.user)
    categories!: Category[]

    @OneToMany(() => Expense, (expense) => expense.user)
    expenses!: Expense[]
}