import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ClinicalInfo } from './clinical-info.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 60, unique: true })
  profileId!: string;

  @Column({ type: 'varchar', length: 80 })
  nome!: string;

  @Column({ type: 'varchar', length: 120 })
  sobrenome!: string;

  @Column({ type: 'date' })
  dt_nasc!: string;

  @Column({ type: 'varchar', length: 30 })
  sexo!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @OneToOne(() => ClinicalInfo, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'clinicalInfoId' })
  clinicalInfo!: ClinicalInfo;
}
