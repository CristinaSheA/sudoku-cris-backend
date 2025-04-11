import { Injectable } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { Competition } from './entities/competition.entity';
import { CompetitionResult } from './entities/competition-result.entity';
import { SubmitSolutionDto } from './dto/submit-solution.dto';
import { JoinCompetitionDto } from './dto/join-competition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CompetitionsService {
  private competitions: Competition[] = [];
  private results: CompetitionResult[] = [];

  constructor(
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
    @InjectRepository(CompetitionResult)
    private competitionResultRepository: Repository<CompetitionResult>,
  ) {}

  public findAll() {
    return this.competitionRepository.find();
  }
  public async findOne(id: string) {
    if (isUUID(id)) {
      const user = await this.competitionRepository.findOneBy({ id: id });
      return user;
    }
  }

  public async createCompetition(createCompetitionDto: CreateCompetitionDto) {
    const competition: Competition = this.competitionRepository.create({
      difficulty: createCompetitionDto.difficulty,
      privacity: createCompetitionDto.privacity,
      maxPlayers: createCompetitionDto.maxPlayers,
      joinCode: createCompetitionDto.joinCode,
      startDate: new Date(),
      participants: [],
      sudoku: this.generateSudoku(),
    });
    this.competitions.push(competition);
    return await this.competitionRepository.save(competition);
  }

  public joinCompetition(competitionId: string, userId: string): Competition {
    const competition = this.competitions.find(
      (comp) => comp.id === competitionId,
    );
    if (!competition) throw new Error('Competition not found');
    competition.participants.push(userId);
    return competition;
  }
  public submitSolution(submitSolutionDto: SubmitSolutionDto) {
    const competition = this.competitions.find(
      (comp) => comp.id === submitSolutionDto.competitionId,
    );
    if (!competition) throw new Error('Competition not found');

    const isCorrect = this.validateSolution(
      competition.sudoku,
      submitSolutionDto.solution,
    );
    const timeTaken =
      (new Date().getTime() - competition.startDate.getTime()) / 1000; // Tiempo en segundos

    const result: CompetitionResult = {
      userId: submitSolutionDto.userId,
      competitionId: submitSolutionDto.competitionId,
      timeTaken,
      isCorrect,
      id: uuidv4()
    };
    this.results.push(result);

    return result;
  }
  public participateInCompetition(joinCompetitionDto: JoinCompetitionDto) {
    const { competitionId, userId } = joinCompetitionDto;
    const competition = this.competitions.find(
      (comp) => comp.id === competitionId,
    );
    if (!competition) {
      throw new Error('Competition not found');
    }
    if (competition.participants.includes(userId)) {
      throw new Error('User already joined this competition');
    }
    competition.participants.push(userId);
    return competition;
  }

  private generateSudoku(): number[][] {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
  }
  private validateSolution(
    original: number[][],
    solution: number[][],
  ): boolean {
    // Lógica para validar la solución
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (original[i][j] !== 0 && original[i][j] !== solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}
