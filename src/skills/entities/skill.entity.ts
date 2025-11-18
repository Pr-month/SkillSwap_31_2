import { User } from 'src/users/entities/user.entity';
import { Column, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Category, (category) => category.id)
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  chuldren: Category[];
}

export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToOne(() => Category, (category) => category.id)
  category: Category;

  @Column()
  images: string[];

  @OneToOne(() => User, (user) => user.id)
  owner: User;
}
