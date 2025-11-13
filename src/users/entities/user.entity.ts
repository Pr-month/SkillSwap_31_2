import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

export type TUserGender = "male" | "female" | "not specified";

export type TUserRole = "ADMIN" | "USER";

export class User {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;
  
  @Column()
  password: string;

  @Column()
  about: string;

  @Column()
  birthday: Date;

  @Column()
  city: string;

  @Column({
    default: "not specified",
    type: "enum",
    enum: ["male", "female", "not specified"]
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
    default: "USER",
    type: "enum",
    enum: ["ADMIN", "USER"]
  })
  role: TUserRole;

  @Column()
  refreshToken: string;
}
