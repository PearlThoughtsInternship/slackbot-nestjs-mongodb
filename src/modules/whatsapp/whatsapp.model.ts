import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'subscribers' })
export class WhatsappModel {

  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "username" })
  username: string;

  @Column({ name: "whatsappnum" })
  whatsappnum: string;

  @Column({ name: "channelid" })
  channelid: string;

  @Column({ name: "userid" })
  userid: string;

  @Column({ name: "timecreated" })
  timecreated: Date;

  @Column({ name: "fullname" })
  fullname: string;

  @Column({ name: "channelname" })
  channelname: string;
}