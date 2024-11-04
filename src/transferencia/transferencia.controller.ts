import { Controller, Post, Body } from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';

@Controller('transferencias')
export class TransferenciaController {
  constructor(private readonly transferenciaService: TransferenciaService) {}

  @Post()
  async realizarTransferencia(
    @Body()
    data: {
      numeroCuentaOrigen: string;
      monto: number;
      ibanDestino: string;
      esMismoBanco: boolean;
    },
  ) {
    return this.transferenciaService.realizarTransferencia(
      data.numeroCuentaOrigen,
      data.monto,
      data.ibanDestino,
      data.esMismoBanco,
    );
  }
}
