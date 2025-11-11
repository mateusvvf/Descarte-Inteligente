import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DescarteModule } from './descarte/descarte.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://mateus_10738568:OCec2vFFj4hqkmJu@descartea7.ihztox9.mongodb.net/?appName=descarteA7'),
    DescarteModule,
  ],
})
export class AppModule {}
