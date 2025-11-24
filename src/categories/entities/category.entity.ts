import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => Category, category => category.children, { nullable: true })
    parent: Category;

    @OneToMany(() => Category, category => category.parent)
    children: Category[];
}