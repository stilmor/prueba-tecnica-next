import { Controller, Patch, Param, Body } from '@nestjs/common';
import { TarjetaService } from './tarjeta.service';

@Controller('tarjeta')
export class TarjetaController {
  constructor(private tarjetaService: TarjetaService) {}

  @Patch(':numeroTarjeta/activar')
  async activarTarjeta(
    @Param('numeroTarjeta') numeroTarjeta: string,
    @Body('cvc') cvc: string,
    @Body('pin') pin: string,
  ) {
    return await this.tarjetaService.activarTarjeta(numeroTarjeta, cvc, pin);
  }

  @Patch(':numeroTarjeta/cambia-pin')
  async cambiarPin(
    @Param('numeroTarjeta') numeroTarjeta: string,
    @Body('pinActual') pinActual: string,
    @Body('nuevoPin') nuevoPin: string,
    @Body('cvc') cvc: string,
  ) {
    return await this.tarjetaService.cambiarPin(
      numeroTarjeta,
      pinActual,
      nuevoPin,
      cvc,
    );
  }
}
