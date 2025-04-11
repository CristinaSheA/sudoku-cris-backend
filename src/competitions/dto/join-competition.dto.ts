import { IsString } from "class-validator";

export class JoinCompetitionDto {
  @IsString()
  competitionId: string;
  @IsString()
  userId: string;
}