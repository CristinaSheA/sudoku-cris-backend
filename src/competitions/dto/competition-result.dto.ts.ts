import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CompetitionResultDto {
  @IsString()
  competitionId: string;
  @IsString()
  userId: string;
  @IsNumber()
  timeTaken: number;
  @IsBoolean()
  isCorrect: boolean;
}