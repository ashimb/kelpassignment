import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('public.users', { schema: 'TestDB' })
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: string;
  @Column('varchar', { name: 'name', nullable: false })
  name: string;
  @Column('int', { name: 'age', nullable: false })
  age: number;
  @Column('varchar', { name: 'address', nullable: true })
  address: string;
  @Column('varchar', { name: 'additional_info', nullable: true })
  additionalInfo: string;
}
