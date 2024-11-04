import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cuenta } from '../models/cuenta.model';

@Module({
  imports: [SequelizeModule.forFeature([Cuenta])],
  providers: [CuentaService],
  controllers: [CuentaController],
  exports: [SequelizeModule],
})
export class CuentaModule {}
