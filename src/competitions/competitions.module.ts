import { Module } from '@nestjs/common';
import { CompetitionsService } from './competitions.service';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsGateway } from './competitions.gateway';
import { Competition } from './entities/competition.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompetitionResult } from './entities/competition-result.entity';

@Module({
  controllers: [CompetitionsController],
  providers: [CompetitionsGateway, CompetitionsService],
  imports: [
    TypeOrmModule.forFeature([Competition, CompetitionResult]),
  ],
  exports: [TypeOrmModule]
})
export class CompetitionsModule {}
