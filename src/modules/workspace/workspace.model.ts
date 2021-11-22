import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'workspace' })
export class WorkspaceModel {

  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "name" })
  name: string;

  @Column({ name: "userId" })
  userId: string;

  @Column({ name: "accessToken" })
  accessToken: string;

  @Column({ name: "team_id" })
  teamId: string;
}