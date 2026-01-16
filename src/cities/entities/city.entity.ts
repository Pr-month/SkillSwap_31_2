import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('city')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  subject: string;
}
