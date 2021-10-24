import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkspaceModel {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userId: string;

  @Column()
  accessToken: string;

  @Column()
  team_id: string;
}