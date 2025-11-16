import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export type TUserGender = 'male' | 'female' | 'not specified';

export type TUserRole = 'ADMIN' | 'USER';

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
    this.password = await bcrypt.hash(this.password);
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.password = await bcrypt.hash(this.password);
  }

  @Column()
  about: string;

  @Column()
  birthday: Date;

  @Column()
  city: string;

  @Column({
    default: 'not specified',
    type: 'enum',
    enum: ['male', 'female', 'not specified'],
  })
  gender: TUserGender;

  @Column()
  avatar: string;

  /*@OneToMany(() => Skill, skill => skill.user)
  skills: */

  /*@ManyToMany(() => Skill, skill => skill.users)
  wantToLearn: */

  /*@ManyToMany(() => Skill, skill => skill.users)
  favoriteSkills : */

  @Column({
    default: 'USER',
    type: 'enum',
    enum: ['ADMIN', 'USER'],
  })
  role: TUserRole;

  @Column()
  refreshToken: string;
}
