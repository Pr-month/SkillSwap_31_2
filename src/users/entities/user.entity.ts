import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGender, Role } from '../users.enums';
import { Skill } from 'src/skills/entities/skill.entity';

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
    this.password = await bcrypt.hash(
      this.password,
      process.env.HASH_SALT || 10,
    );
  }

  @Column()
  about: string;

  @Column()
  birthday: Date;

  @Column()
  city: string;

  @Column({
    default: UserGender['not specified'],
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column()
  avatar: string;

  @OneToMany(() => Skill, (skill) => skill.owner)
  skills?: Skill[];

  /*@ManyToMany(() => Skill, skill => skill.users)
  wantToLearn: */

  @ManyToMany(() => Skill, skill => skill.favoritedBy)
  favoriteSkills: Skill[];

  @Column({
    default: Role.User,
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column()
  refreshToken: string;
}
