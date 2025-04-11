import { IsString } from "class-validator";

export class SubmitSolutionDto {
  @IsString()
  competitionId: string;
  @IsString()
  userId: string;
  solution: number[][];
}