import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUser } from './dto/create-user.dto';
import { LoginResponse, LoginUserDetails } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import genToken from '../utils/genToken';
import { Roles } from './Types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private users: Repository<Users>,
    @Inject('JWT_ACCESS') private readonly jwt_access: JwtService,
    private readonly mailService: MailService,
  ) {}

  async findOneById(id: string): Promise<Users> {
    return this.users.findOne({ where: { id } });
  }

  async createUser(createUser: CreateUser) {
    const user = this.users.create(createUser);
    const { token, tokenExpiry } = genToken();
    user.token = token;
    user.tokenExpiry = tokenExpiry;

    if (createUser.isInstructor) user.role = Roles.INSTRUCTOR;

    await this.users.save(user);
    await this.mailService.sendUserWelcomeEmail(
      {
        username: user.name,
        email: user.email,
      },
      token,
    );
  }

  async findUserByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }

  async loginUser(loginUser: LoginUserDetails): Promise<LoginResponse> {
    const user = await this.findUserByEmail(loginUser.email);

    if (!user) throw new UnauthorizedException('Invalid user credentials');

    const passwordMatch = user.password === loginUser.password;

    if (!passwordMatch)
      throw new UnauthorizedException('Invalid user credentials');

    const accessToken = await this.jwt_access.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    delete user.password;

    return { accessToken, user };
  }

  async confirmEmail(token: string) {
    const tokenDetails = await this.users.findOne({ where: { token } });

    if (!tokenDetails)
      throw new UnprocessableEntityException({
        message: 'Invalid confirmation token sent',
      });

    if (tokenDetails.emailVerified)
      throw new UnprocessableEntityException({
        message: 'Email already verified, please login',
      });

    const today = new Date();
    const tokenExpiry = new Date(tokenDetails.tokenExpiry);
    const tokenInvalid = tokenDetails.usedToken;
    const tokenExpired = today > tokenExpiry;
    if (tokenInvalid || tokenExpired)
      throw new UnprocessableEntityException({
        message: 'Token not valid, please generate another',
      });

    tokenDetails.emailVerified = true;
    tokenDetails.usedToken = true;

    await this.users.save(tokenDetails);
  }
}
