import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('clinical_infos')
export class ClinicalInfo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  tipoSanguineo!: string | null;

  @Column({ type: 'text', nullable: true })
  alergias!: string | null;

  @Column({ type: 'text', nullable: true })
  medicamentos!: string | null;

  @Column({ type: 'text', nullable: true })
  doencas!: string | null;

  @Column({ type: 'text', nullable: true })
  cirurgias!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  emergenciaNome!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  emergenciaTelefone!: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  senhaPublica!: string | null;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}
