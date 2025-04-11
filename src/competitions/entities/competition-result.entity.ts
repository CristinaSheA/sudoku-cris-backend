import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CompetitionResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  userId: string;
  @Column('text')
  competitionId: string;
  @Column()
  timeTaken: number;
  @Column()
  isCorrect: boolean;
}