import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './config/sequelize.config';
import { CuentaModule } from './cuenta/cuenta.module';
import { TransferenciaModule } from './transferencia/transferencia.module';
import { TarjetaModule } from './tarjeta/tarjeta.module';
import { MovimientoModule } from './movimiento/movimiento.module';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [
    SequelizeModule.forRoot(sequelizeConfig),
    CuentaModule,
    TransferenciaModule,
    TarjetaModule,
    MovimientoModule,
    ClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
