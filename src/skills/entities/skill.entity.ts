import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.children)
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children?: Category[];

  // @OneToMany(() => Skill, (skill) => skill.category)
  // skils?: Skill[];
}

@Entity('skill')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  // @ManyToOne(() => Category, (category) => category.skils)
  // category: Category;

  @Column()
  images: string[];

  @ManyToOne(() => User, (user) => user.skills, {
    nullable: false,
  })
  owner: User;
}
