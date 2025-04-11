import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import { UpdateCompetitionDto } from './dto/update-competition.dto';
import { JoinCompetitionDto } from './dto/join-competition.dto';
import { SubmitSolutionDto } from './dto/submit-solution.dto';

@Controller('competitions')
export class CompetitionsController {
  constructor(private readonly competitionsService: CompetitionsService) {}

  @Get()
  getCompetitions() {
    return this.competitionsService.findAll();
  }

  @Post()
  createCompetition(@Body() createCompetitionDto: CreateCompetitionDto) {
    return this.competitionsService.createCompetition(createCompetitionDto);
  }

  @Post(':id/join')
  joinCompetition(@Param('id') competitionId: string, @Body() joinCompetitionDto: JoinCompetitionDto) {
    return this.competitionsService.joinCompetition(competitionId, joinCompetitionDto.userId);
  }

  @Post(':id/submit')
  submitSolution(@Body() submitSolutionDto: SubmitSolutionDto) {
    return this.competitionsService.submitSolution(submitSolutionDto);
  }
}
