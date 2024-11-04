import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MovimientoController } from './movimiento.controller';
import { Movimiento } from '../models/movimiento.model';
import { MovimientoService } from './movimiento.service';

@Module({
  imports: [SequelizeModule.forFeature([Movimiento])],
  providers: [MovimientoService],
  controllers: [MovimientoController],
  exports: [MovimientoService, SequelizeModule],
})
export class MovimientoModule {}
