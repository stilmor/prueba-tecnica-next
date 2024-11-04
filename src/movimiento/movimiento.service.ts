import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movimiento } from '../models/movimiento.model';

@Injectable()
export class MovimientoService {
  constructor(
    @InjectModel(Movimiento) private movimientoModel: typeof Movimiento,
  ) {}

  async findByCuentaId(cuentaId: number): Promise<Movimiento[]> {
    return this.movimientoModel.findAll({ where: { cuentaId } });
  }
}
