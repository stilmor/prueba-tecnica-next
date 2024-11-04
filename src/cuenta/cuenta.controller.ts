import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CuentaService } from './cuenta.service';
import { Movimiento } from '../models/movimiento.model';

@Controller('cuenta')
export class CuentaController {
  constructor(private readonly cuentaService: CuentaService) {}

  @Get(':numeroCuenta/movimientos')
  async obtenerMovimientos(
    @Param('numeroCuenta') numeroCuenta: string,
  ): Promise<Movimiento[]> {
    return this.cuentaService.obtenerMovimientos(numeroCuenta);
  }

  @Patch(':numeroCuenta/retirar')
  async retirarDinero(
    @Param('numeroCuenta') numeroCuenta: string,
    @Body() data: { monto: number; numeroTarjeta: string; cvc: string },
  ) {
    return this.cuentaService.retirarDinero(
      numeroCuenta,
      data.monto,
      data.numeroTarjeta,
      data.cvc,
    );
  }

  @Patch(':numeroCuenta/ingresar')
  async ingresarDinero(
    @Param('numeroCuenta') numeroCuenta: string,
    @Body() data: { monto: number, esCajeroPropio: boolean },
  ) {
    return this.cuentaService.ingresarDinero(
      numeroCuenta,
      data.monto,
      data.esCajeroPropio,
    );
  }
}
