import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DescarteController } from './descarte.controller';
import { DescarteService } from './descarte.service';
import { DescarteSchema } from './descarte.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Descarte', schema: DescarteSchema }]),
  ],
  controllers: [DescarteController],
  providers: [DescarteService],
})
export class DescarteModule {}
