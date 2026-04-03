import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async accessPublicProfile(profileId: string, password?: string, frontendUrl?: string) {
    const user = await this.usersService.findByProfileId(profileId);

    if (!user) {
      throw new NotFoundException('Perfil não encontrado.');
    }

    const expectedPassword = user.clinicalInfo?.senhaPublica?.trim();
    const informedPassword = password?.trim();

    if (expectedPassword && expectedPassword !== informedPassword) {
      throw new UnauthorizedException('Senha pública inválida para este perfil.');
    }

    const baseUrl = frontendUrl ?? this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    return this.usersService.serializePublicProfile(user, baseUrl);
  }
}
