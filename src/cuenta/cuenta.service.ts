import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cuenta } from '../models/cuenta.model';
import { Movimiento } from '../models/movimiento.model';
import { Tarjeta } from '../models/tarjeta.model';

@Injectable()
export class CuentaService {
  constructor(@InjectModel(Cuenta) private cuentaModel: typeof Cuenta) {}

  async obtenerMovimientos(numeroCuenta: string): Promise<Movimiento[]> {
    const cuenta = await this.cuentaModel.findOne({
      where: { numeroCuenta },
      include: [Movimiento],
    });

    if (!cuenta) {
      throw new BadRequestException('La cuenta no existe');
    }

    return cuenta.movimientos;
  }

  async retirarDinero(
    numeroCuenta: string,
    monto: number,
    numeroTarjeta: string,
    cvc: string,
  ): Promise<Movimiento> {
    const cuenta = await this.cuentaModel.findOne({ where: { numeroCuenta } });
    if (!cuenta) throw new BadRequestException('Cuenta no encontrada');

    const tarjeta = await Tarjeta.findOne({
      where: { numeroTarjeta, cuentaId: cuenta.id },
    });
    if (!tarjeta || tarjeta.cvc !== cvc)
      throw new BadRequestException('Tarjeta no válida');

    if (tarjeta.tipo === 'debito' && cuenta.saldo < monto) {
      throw new BadRequestException('Saldo insuficiente');
    }
    if (tarjeta.tipo === 'credito' && tarjeta.limiteCredito < monto) {
      throw new BadRequestException('Límite de crédito excedido');
    }

    cuenta.saldo -= monto;
    await cuenta.save();

    return await Movimiento.create({
      cuentaId: cuenta.id,
      tipo: 'retiro',
      monto,
      fecha: new Date(),
    });
  }

  async ingresarDinero(
    numeroCuenta: string,
    monto: number,
    esCajeroPropio: boolean,
  ): Promise<Movimiento> {
    if (!esCajeroPropio)
      throw new BadRequestException(
        'Ingreso permitido solo en cajeros propios',
      );

    const cuenta = await this.cuentaModel.findOne({ where: { numeroCuenta } });
    if (!cuenta) throw new BadRequestException('Cuenta no encontrada');

    cuenta.saldo += monto;
    await cuenta.save();

    return await Movimiento.create({
      cuentaId: cuenta.id,
      tipo: 'ingreso',
      monto,
      fecha: new Date(),
    });
  }
}
