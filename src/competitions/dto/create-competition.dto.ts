import { IsNumber, IsString } from "class-validator";

export class CreateCompetitionDto {
  @IsString()
  difficulty: string;
  @IsString()
  privacity: string;
  @IsNumber()
  maxPlayers: number;
  @IsString()
  joinCode: string
}
