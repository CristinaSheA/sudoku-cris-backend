import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, UpdateUserDto, CreateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      user.gamesPlayed = 0
      user.gamesWon = 0
      user.successRate = 0

      user.hardGamesWon = 0
      user.mediumGamesWon = 0
      user.easyGamesWon = 0
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
      throw new Error('No user');
    }
  
    const isValidPassword = await bcrypt.compareSync(password, user.password);
  
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }
  
    return { ...user};
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
