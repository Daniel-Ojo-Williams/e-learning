import { Module, Provider } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions, JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

const JWT_PROVIDER = (
  provide: string,
  secretName: string,
  expiresIn: JwtSignOptions['expiresIn'],
): Provider => ({
  provide,
  useFactory: (config: ConfigService) => {
    const secret = config.get<string>(secretName);

    return new JwtService({
      secret,
      signOptions: { expiresIn },
    });
  },
  inject: [ConfigService],
});
const JWT_ACCESS = () => JWT_PROVIDER('JWT_ACCESS', 'JWT_SECRET', '5h');
// const JWT_REFRESH = () => JWT_PROVIDER('JWT_REFRESH', 'JWT_REFRESH', '7d');

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersResolver, UsersService, JWT_ACCESS(), MailService],
  exports: [JWT_ACCESS(), UsersService],
})
export class UsersModule {}
