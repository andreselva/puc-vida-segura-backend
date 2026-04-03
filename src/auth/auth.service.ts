import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const passwordValid = await this.usersService.validatePassword(user, dto.senha);

    if (!passwordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return {
      token: await this.generateToken(user.id, user.email),
      user: this.usersService.serializeLoginUser(user),
    };
  }

  async register(dto: RegisterDto) {
    if (dto.senha !== dto.confirmSenha) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    const user = await this.usersService.create({
      nome: dto.nome,
      sobrenome: dto.sobrenome,
      dt_nasc: dto.dt_nasc,
      sexo: dto.sexo,
      email: dto.email,
      senha: dto.senha,
    });

    return {
      message: 'Cadastro realizado com sucesso.',
      token: await this.generateToken(user.id, user.email),
      user: this.usersService.serializeLoginUser(user),
    };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    return user ? this.usersService.serializeUser(user) : null;
  }

  getDemoAccess(frontendUrl?: string) {
    const frontendBaseUrl = frontendUrl ?? this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    const demo = this.usersService.getDemoAccess();

    return {
      ...demo,
      profileUrl: `${frontendBaseUrl}/acesso-medico?profile=${demo.profileId}`,
    };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.signAsync({ sub: userId, email });
  }
}
