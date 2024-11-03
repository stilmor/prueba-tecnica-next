import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Cliente } from './cliente.model';
import { Tarjeta } from './tarjeta.model';
import { Movimiento } from './movimiento.model';

@Table({ tableName: 'cuentas' })
export class Cuenta extends Model<Cuenta> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  numeroCuenta: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  saldo: number;

  @ForeignKey(() => Cliente)
  @Column
  clienteId: number;

  @BelongsTo(() => Cliente)
  cliente: Cliente;

  @HasMany(() => Tarjeta)
  tarjetas: Tarjeta[];

  @HasMany(() => Movimiento)
  movimientos: Movimiento[];
}
