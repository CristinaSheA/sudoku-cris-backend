import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text', {
    unique: true
  })
  username: string;

  @Column('text', {
    unique: true
  })
  email: string;

  @Column('text')
  password: string;
  
  @Column()
  gamesPlayed: number;

  @Column('json', { 
    default: { 
      easy: 0, 
      medium: 0, 
      hard: 0 
    } 
  })
  gamesWon: {
    easy: number;
    medium: number;
    hard: number;
  };

  @Column()
  successRate: number;
}