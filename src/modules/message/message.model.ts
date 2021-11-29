import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'text' })
export class MessageModel {

  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "senderID" })
  senderID: string;

  @Column({ name: "message" })
  message: string;

  @Column({ name: "receivedOn" })
  receivedOn: string;

  @Column({ name: "forwardedFrom" })
  forwardedFrom: string;
  
  @Column({ name: "notificationType" })
  notificationType: string;
  
  @Column({ name: "channelRouted" })
  channelRouted: string;
  
  @Column({ name: "blocks" })
  blocks: string;
}