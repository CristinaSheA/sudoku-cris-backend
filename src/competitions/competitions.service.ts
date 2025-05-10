import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { Competition } from './entities/competition.entity';
import { CompetitionResult } from './entities/competition-result.entity';
import { SubmitSolutionDto } from './dto/submit-solution.dto';
import { JoinCompetitionDto } from './dto/join-competition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { UpdateCompetitionDto } from './dto/update-competition.dto';

@Injectable()
export class CompetitionsService {
  private competitions: Competition[] = [];
  private results: CompetitionResult[] = [];

  constructor(
    @InjectRepository(Competition)
    private readonly competitionRepository: Repository<Competition>,
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
    const competition = this.competitionRepository.create({
      difficulty: createCompetitionDto.difficulty,
      privacity: createCompetitionDto.privacity,
      maxPlayers: createCompetitionDto.maxPlayers,
      joinCode: this.generateJoinCode(),
      startDate: new Date(),
      players: [createCompetitionDto.creatorId],
      sudoku: createCompetitionDto.sudoku,
    });

    return await this.competitionRepository.save(competition);
  }
  public async updateCompetition(
    id: string,
    updateCompetitionDto: UpdateCompetitionDto,
  ) {
    const competition = await this.competitionRepository.preload({
      ...updateCompetitionDto,
      id,
    });
    console.log(updateCompetitionDto);
    return await this.competitionRepository.save(competition);
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
      (new Date().getTime() - competition.startDate.getTime()) / 1000;

    const result: CompetitionResult = {
      userId: submitSolutionDto.userId,
      competitionId: submitSolutionDto.competitionId,
      timeTaken,
      isCorrect,
      id: uuidv4(),
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
    if (competition.players.includes(userId)) {
      throw new Error('User already joined this competition');
    }
    competition.players.push(userId);
    return competition;
  }
  private generateJoinCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
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
  public async joinCompetition(competitionId: string, userId: string) {
    const competition = await this.findOne(competitionId);
    if (!competition) {
      throw new NotFoundException('Competition not found');
    }
    if (competition.players.includes(userId)) {
      throw new BadRequestException('User already in competition');
    }
    if (
      competition.privacity === 'private' &&
      competition.players.length >= competition.maxPlayers
    ) {
      throw new BadRequestException('Competition is full');
    }
    competition.players.push(userId);
    await this.competitionRepository.save(competition);

    return {
      message: 'Successfully joined competition',
      competition,
    };
  }
}
