import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ type: 'text', array: true })
  images: string[];

  @ManyToOne(() => User, (user) => user.skills, {
    nullable: false,
  })
  owner: User;

  @ManyToMany(() => User, (user) => user.favoriteSkills)
  favoritedBy: User[];
}
