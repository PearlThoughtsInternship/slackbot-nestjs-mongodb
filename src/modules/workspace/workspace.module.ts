import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceService } from './workspace.service';
import { WorkspaceModel } from './workspace.model';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceModel])],
  controllers: [],
  providers: [WorkspaceService],
  exports: [TypeOrmModule, WorkspaceService]
})
export class WorkspaceModule {}
