import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SaveClinicalInfoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  tipoSanguineo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alergias?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicamentos?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doencas?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cirurgias?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  emergenciaNome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  emergenciaTelefone?: string;

  @ApiPropertyOptional({ description: 'Senha para acesso público ao perfil do paciente' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  senhaPublica?: string;
}
