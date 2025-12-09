import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role, UserGender } from '../users.enums';
import { Skill } from 'src/skills/entities/skill.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column()
  password: string;

@BeforeInsert()
async beforeInsert() {
  if (this.password) {
    const saltRounds = 10; // Фиксированное значение для простоты
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}

  @Column()
  about: string;

  @Column()
  birthday: Date;

  @Column()
  city: string;

  @Column({
    default: UserGender.notSpecified,
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column()
  avatar: string;

  @OneToMany(() => Skill, (skill) => skill.owner)
  skills?: Skill[];

  @ManyToMany(() => Category)
  @JoinTable()
  wantToLearn: Category[];

  @ManyToMany(() => Skill, (skill) => skill.favoritedBy)
  favoriteSkills: Skill[];

  @Column({
    default: Role.User,
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string | null;
}
