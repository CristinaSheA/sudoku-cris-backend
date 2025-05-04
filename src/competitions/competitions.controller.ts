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
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.competitionsService.findOne(id);
  }
  @Post()
  createCompetition(@Body() createCompetitionDto: CreateCompetitionDto) {
    return this.competitionsService.createCompetition(createCompetitionDto);
  }
  @Patch(':id/join')
  async joinCompetition(
    @Param('id') competitionId: string,
    @Body() body: { userId: string }
  ) {
    return this.competitionsService.joinCompetition(competitionId, body.userId);
  }

  @Post(':id/submit')
  submitSolution(@Body() submitSolutionDto: SubmitSolutionDto) {
    return this.competitionsService.submitSolution(submitSolutionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompetitionDto: UpdateCompetitionDto) {
    return this.competitionsService.updateCompetition(id, updateCompetitionDto);
  }

}
