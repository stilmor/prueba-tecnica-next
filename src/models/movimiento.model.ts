import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Cuenta } from './cuenta.model';

@Table({ tableName: 'movimientos' })
export class Movimiento extends Model<Movimiento> {
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  monto: number;

  @Column({
    type: DataType.ENUM('ingreso', 'retiro', 'comision', 'transferencia'),
    allowNull: false,
  })
  tipo: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  fecha: Date;

  @ForeignKey(() => Cuenta)
  @Column
  cuentaId: number;

  @BelongsTo(() => Cuenta)
  cuenta: Cuenta;
}
