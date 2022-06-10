import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'view_otp_log' })
export class ViewOtpLogModel {

  @PrimaryGeneratedColumn({ name: "id" })
  id: number;

  @Column({ name: "text_id" })
  text_id: number;

  @Column({ name: "user_name" })
  user_name: string;

  @Column({ name: "user_id" })
  user_id: string;

  @Column({ name: "workspace_id"})
  workspace_id:number;

  @Column({ name:"created_on"})
  created_on:string;
  
}