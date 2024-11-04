import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cliente } from '../models/cliente.model';

@Module({
  imports: [SequelizeModule.forFeature([Cliente])],
  providers: [],
  controllers: [],
  exports: [],
})
export class ClienteModule {}
