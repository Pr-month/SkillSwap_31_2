import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { IsNotEmpty } from 'class-validator';

@Entity('skill')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

/*   @ManyToOne(() => Category, (category) => category.skills, {
    nullable: true,
  })
  category: Category; */

  @ManyToOne(() => Category, { eager: true, nullable: false })
  @JoinColumn()
  @IsNotEmpty()
  category: Category;

  @ManyToMany(() => User, (user) => user.wantToLearn)
  wantToLearnBy: User[];

  @Column({ type: 'text', array: true })
  images: string[];

  @ManyToOne(() => User, (user) => user.skills, {
    nullable: false,
  })
  owner: User;

  @ManyToMany(() => User, (user) => user.favoriteSkills)
  favoritedBy: User[];
}
