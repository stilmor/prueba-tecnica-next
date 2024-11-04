import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tarjeta } from '../models/tarjeta.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TarjetaService {
  constructor(@InjectModel(Tarjeta) private tarjetaModel: typeof Tarjeta) {}

  async activarTarjeta(
    numeroTarjeta: string,
    cvc: string,
    pin: string,
  ): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaModel.findOne({
      where: { numeroTarjeta },
    });
    if (!tarjeta) throw new BadRequestException('Tarjeta no encontrada');

    if (tarjeta.activa) throw new BadRequestException('Tarjeta ya activada');

    if (Number(tarjeta.cvc) !== Number(cvc))
      throw new BadRequestException('CVC incorrecto');

    if (!pin)
      throw new BadRequestException('El pin es obligatorio para la activacion');

    tarjeta.pin = await bcrypt.hash(pin, 10);
    tarjeta.activa = true;
    return tarjeta.save();
  }

  async cambiarPin(
    numeroTarjeta: string,
    pinActual: string,
    nuevoPin: string,
    cvc: string,
  ): Promise<Tarjeta> {
    const tarjeta = await this.tarjetaModel.findOne({
      where: { numeroTarjeta },
    });
    if (!tarjeta) throw new BadRequestException('Tarjeta no encontrada');

    if (!tarjeta.activa) throw new BadRequestException('Tarjeta no activada');

    if (Number(tarjeta.cvc) !== Number(cvc))
      throw new BadRequestException('CVC incorrecto');

    if (!pinActual)
      throw new BadRequestException(
        'El pin actual es obligatorio para cambiar el pin',
      );

    if (!nuevoPin)
      throw new BadRequestException(
        'El nuevo pin es obligatorio para cambiar el pin',
      );
    const isPinCorrect = await bcrypt.compare(pinActual, tarjeta.pin);
    if (!isPinCorrect) throw new BadRequestException('PIN actual incorrecto');

    tarjeta.pin = await bcrypt.hash(nuevoPin, 10);
    return tarjeta.save();
  }
}
