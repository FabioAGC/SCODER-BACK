import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString, IsEnum, IsDate, Min } from 'class-validator';

export enum EntryType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

@Entity('accounting_entries')
export class AccountingEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @Column()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  @Column({
    type: 'enum',
    enum: EntryType
  })
  @IsNotEmpty()
  @IsEnum(EntryType)
  type: EntryType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 