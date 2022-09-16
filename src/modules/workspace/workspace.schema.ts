import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Workspace extends Document {
  @Prop()
  _id: string;

  @Prop()
  teamName: string;

  @Prop()
  botId: string;

  @Prop()
  botAccessToken: string;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
