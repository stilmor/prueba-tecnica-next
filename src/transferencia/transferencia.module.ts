// transferencia.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TransferenciaService } from './transferencia.service';
import { TransferenciaController } from './transferencia.controller';
import { Movimiento } from '../models/movimiento.model';
import { CuentaModule } from '../cuenta/cuenta.module';

@Module({
  imports: [SequelizeModule.forFeature([Movimiento]), CuentaModule],
  controllers: [TransferenciaController],
  providers: [TransferenciaService],
})
export class TransferenciaModule {}
