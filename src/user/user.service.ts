import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, UpdateUserDto, CreateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      user.gamesPlayed = 0
      user.gamesWon = {
        easy: 0,
        medium: 0,
        hard: 0
      }
      user.successRate = 0

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBErrors(error)
    }
  }
  public async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      ...user,
      token,
    };
  }
  public async update(id: string, updateUserDto: UpdateUserDto) {
    const { ...toUpdate } = updateUserDto;

    const user = await this.userRepository.preload({ id, ...toUpdate });
    
    return await this.userRepository.save(user);
  }
  public async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    console.log(user);
    
  }
  public findAll() {
    return this.userRepository.find()
  }
  public async findOne(id: string) {
    if (isUUID(id)) {
      const user = await this.userRepository.findOneBy({ id: id });
      return user
    }
  }
  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
  
}
