import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCompetitionDto {
  @IsString()
  difficulty: string;
  @IsString()
  privacity: string;
  @IsNumber()
  maxPlayers: number;
  @IsString()
  @IsNotEmpty()
  creatorId: string

  sudoku: [][];
}
