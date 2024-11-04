import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tarjeta } from '../models/tarjeta.model';
import { TarjetaService } from './tarjeta.service';
import { TarjetaController } from './tarjeta.controller';

@Module({
  imports: [SequelizeModule.forFeature([Tarjeta])],
  providers: [TarjetaService],
  controllers: [TarjetaController],
  exports: [TarjetaService],
})
export class TarjetaModule {}
