import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CompetitionsService } from './competitions.service';
import { JoinCompetitionDto } from './dto/join-competition.dto';
import { SubmitSolutionDto } from './dto/submit-solution.dto';

@WebSocketGateway({ cors: true })
export class CompetitionsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly competitionService: CompetitionsService) {}

  @SubscribeMessage('joinCompetition')
  handleJoinCompetition(
    @MessageBody() joinData: JoinCompetitionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const sudoku = this.competitionService.participateInCompetition(joinData);
    client.join(sudoku.id);
    client.emit('competitionData', { sudoku });
  }
  
  @SubscribeMessage('submitSolution')
  handleSubmitSolution(
    @MessageBody() data: SubmitSolutionDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = this.competitionService.submitSolution(data);
    this.server.to(result.competitionId).emit('solutionResult', result);
  }
}
