import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'rule' })
export class ChannelModel {

  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "senderID" })
  senderID: string;

  @Column({ name: "ForwardedFrom" })
  ForwardedFrom: string;

  @Column({ name: "type" })
  type: string;

  @Column({ name: "channelID" })
  channelID: string;

  @Column({ name: "workspaceId" })
  workspaceId: string;
}