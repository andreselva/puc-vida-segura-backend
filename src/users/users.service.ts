import { ConflictException, ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ClinicalInfo } from './entities/clinical-info.entity';
import { User } from './entities/user.entity';
import { SaveClinicalInfoDto } from './dto/save-clinical-info.dto';
import * as bcrypt from 'bcrypt';

export interface RegisterUserInput {
  nome: string;
  sobrenome: string;
  dt_nasc: string;
  sexo: string;
  email: string;
  senha: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ClinicalInfo)
    private readonly clinicalInfoRepository: Repository<ClinicalInfo>,
  ) {}

  async onModuleInit() {
    await this.seedDemoUser();
  }

  async create(input: RegisterUserInput): Promise<User> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const existingUser = await this.usersRepository.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
      throw new ConflictException('Já existe um cadastro com esse e-mail.');
    }

    const passwordHash = await bcrypt.hash(input.senha, 10);
    const clinicalInfo = this.clinicalInfoRepository.create({});

    const user = this.usersRepository.create({
      profileId: `perfil-${uuid().slice(0, 8)}`,
      nome: input.nome.trim(),
      sobrenome: input.sobrenome.trim(),
      dt_nasc: input.dt_nasc,
      sexo: input.sexo.trim(),
      email: normalizedEmail,
      passwordHash,
      clinicalInfo,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email: email.trim().toLowerCase() } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByProfileId(profileId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { profileId } });
  }

  async updateClinicalInfo(requestingUserId: string, targetUserId: string, dto: SaveClinicalInfoDto): Promise<User> {
    if (requestingUserId !== targetUserId) {
      throw new ForbiddenException('Você não pode alterar os dados clínicos de outro usuário.');
    }

    const user = await this.findById(targetUserId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const nextClinicalInfo = this.clinicalInfoRepository.merge(user.clinicalInfo ?? this.clinicalInfoRepository.create({}), {
      tipoSanguineo: dto.tipoSanguineo ?? user.clinicalInfo?.tipoSanguineo ?? null,
      alergias: dto.alergias ?? user.clinicalInfo?.alergias ?? null,
      medicamentos: dto.medicamentos ?? user.clinicalInfo?.medicamentos ?? null,
      doencas: dto.doencas ?? user.clinicalInfo?.doencas ?? null,
      cirurgias: dto.cirurgias ?? user.clinicalInfo?.cirurgias ?? null,
      emergenciaNome: dto.emergenciaNome ?? user.clinicalInfo?.emergenciaNome ?? null,
      emergenciaTelefone: dto.emergenciaTelefone ?? user.clinicalInfo?.emergenciaTelefone ?? null,
      senhaPublica: dto.senhaPublica ?? user.clinicalInfo?.senhaPublica ?? null
    });

    user.clinicalInfo = await this.clinicalInfoRepository.save(nextClinicalInfo);
    return this.usersRepository.save(user);
  }

  async validatePassword(user: User, plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, user.passwordHash);
  }

  serializeUser(user: User) {
    return {
      id: user.id,
      profileId: user.profileId,
      nome: user.nome,
      sobrenome: user.sobrenome,
      dt_nasc: user.dt_nasc,
      sexo: user.sexo,
      email: user.email,
      clinicalInfo: {
        tipoSanguineo: user.clinicalInfo?.tipoSanguineo ?? '',
        alergias: user.clinicalInfo?.alergias ?? '',
        medicamentos: user.clinicalInfo?.medicamentos ?? '',
        doencas: user.clinicalInfo?.doencas ?? '',
        cirurgias: user.clinicalInfo?.cirurgias ?? '',
        emergenciaNome: user.clinicalInfo?.emergenciaNome ?? '',
        emergenciaTelefone: user.clinicalInfo?.emergenciaTelefone ?? '',
        senhaPublica: user.clinicalInfo?.senhaPublica ?? '',
      },
      createdAt: user.createdAt,
    };
  }

  serializeLoginUser(user: User) {
    return {
      id: user.id,
      nome: `${user.nome} ${user.sobrenome}`.trim(),
      email: user.email,
      profileId: user.profileId,
    };
  }

  serializePublicProfile(user: User, baseUrl: string) {
    return {
      id: user.id,
      profileId: user.profileId,
      nomeCompleto: `${user.nome} ${user.sobrenome}`.trim(),
      sexo: user.sexo,
      dt_nasc: user.dt_nasc,
      email: user.email,
      clinicalInfo: {
        tipoSanguineo: user.clinicalInfo?.tipoSanguineo ?? '',
        alergias: user.clinicalInfo?.alergias ?? '',
        medicamentos: user.clinicalInfo?.medicamentos ?? '',
        doencas: user.clinicalInfo?.doencas ?? '',
        cirurgias: user.clinicalInfo?.cirurgias ?? '',
        emergenciaNome: user.clinicalInfo?.emergenciaNome ?? '',
        emergenciaTelefone: user.clinicalInfo?.emergenciaTelefone ?? '',
      },
      profileUrl: `${baseUrl}/acesso-medico?profile=${user.profileId}`,
    };
  }

  getDemoAccess() {
    return {
      email: 'joao.silva@vidasegura.app',
      senha: '123456',
      senhaPublica: '4321',
      profileId: 'perfil-demo-001',
      profileUrl: 'http://localhost:5173/acesso-medico?profile=perfil-demo-001',
    };
  }

  private async seedDemoUser(): Promise<void> {
    const demoEmail = 'joao.silva@vidasegura.app';
    const existingDemoUser = await this.usersRepository.findOne({ where: { email: demoEmail } });

    if (existingDemoUser) {
      return;
    }

    const user = this.usersRepository.create({
      profileId: 'perfil-demo-001',
      nome: 'João',
      sobrenome: 'da Silva',
      dt_nasc: '1987-05-13',
      sexo: 'Masculino',
      email: demoEmail,
      passwordHash: await bcrypt.hash('123456', 10),
      clinicalInfo: this.clinicalInfoRepository.create({
        tipoSanguineo: 'O+',
        alergias: 'Penicilina, poeira',
        medicamentos: 'Losartana 50mg (uso diário)',
        doencas: 'Hipertensão arterial',
        cirurgias: 'Apendicectomia (2015)',
        emergenciaNome: 'Mariana Silva',
        emergenciaTelefone: '(54) 99987-4321',
        senhaPublica: '4321',
      }),
    });

    await this.usersRepository.save(user);
  }
}
