import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AccessProfileDto {
  @ApiPropertyOptional({ description: 'Senha pública do perfil' })
  @IsOptional()
  @IsString()
  password?: string;
}
