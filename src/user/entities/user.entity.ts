import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: number;
  @Column('text', {
    unique: true
  })
  username: string;
  @Column('text', {
    unique: true
  })
  email: string;
  @Column('text', {
    unique: true
  })
  password: string;
  
  @Column()
  gamesPlayed: number;
  @Column()
  gamesWon: number;
  @Column()
  successRate: number;
   
  easyGamesWon: number;

  mediumGamesWon: number;

  hardGamesWon: number;
}