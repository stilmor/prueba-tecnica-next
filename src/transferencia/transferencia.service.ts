import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movimiento } from '../models/movimiento.model';
import { Cuenta } from '../models/cuenta.model';

@Injectable()
export class TransferenciaService {
  constructor(
    @InjectModel(Movimiento) private movimientoModel: typeof Movimiento,
    @InjectModel(Cuenta) private cuentaModel: typeof Cuenta,
  ) {}

  private validarIBAN(iban: string): boolean {
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
    return ibanRegex.test(iban);
  }

  async realizarTransferencia(
    numeroCuentaOrigen: string,
    monto: number,
    ibanDestino: string,
    esMismoBanco: boolean,
  ): Promise<Movimiento> {
    const cuenta = await this.cuentaModel.findOne({
      where: { numeroCuenta: numeroCuentaOrigen },
    });

    if (!cuenta)
      throw new BadRequestException('Cuenta de origen no encontrada');
    if (!this.validarIBAN(ibanDestino)) {
      throw new BadRequestException('IBAN inválido');
    }

    const comision = esMismoBanco ? 0 : 5; // Ejemplo de comisión
    const total = monto + comision;

    if (cuenta.saldo < total) {
      throw new BadRequestException('Saldo insuficiente para la transferencia');
    }

    cuenta.saldo -= total;
    await cuenta.save();

    const movimiento = await this.movimientoModel.create({
      cuentaId: cuenta.id,
      tipo: 'transferencia',
      monto: total,
      fecha: new Date(),
    });

    return movimiento;
  }
}
