import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import dotenv from 'dotenv'
import Expense from './Expense';
import User from './User';
dotenv.config()
  
@Entity()
export default class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('text')
    name!: string;

    @ManyToOne(() => User, (user) => user.categories)
    user!: User
    
    @OneToMany(() => Expense, (expense) => expense.category, {cascade:true, onDelete: 'CASCADE'})
    expenses!: Expense[]

    @Column('int',{nullable:true})
    limit!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}