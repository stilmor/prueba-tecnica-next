import { Controller, Get, Param } from '@nestjs/common';
import { MovimientoService } from './movimiento.service';
import { Movimiento } from '../models/movimiento.model';

@Controller('movimientos')
export class MovimientoController {
  constructor(private readonly movimientoService: MovimientoService) {}

  @Get(':cuentaId')
  async findByCuentaId(
    @Param('cuentaId') cuentaId: string,
  ): Promise<Movimiento[]> {
    return this.movimientoService.findByCuentaId(+cuentaId);
  }
}
