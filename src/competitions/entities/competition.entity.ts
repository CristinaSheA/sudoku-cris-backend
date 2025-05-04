import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Competition {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text')
  difficulty: string;

  @Column()
  startDate: Date;

  @Column({ type: 'simple-array', default: [] })
  players: string[];
  
  @Column('json')
  sudoku: number[][];

  @Column({ nullable: true })
  privacity: string;

  @Column({ nullable: true })
  maxPlayers: number;

  @Column({ nullable: true })
  joinCode: string;
}
