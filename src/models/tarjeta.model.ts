import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Cuenta } from './cuenta.model';

@Table({ tableName: 'tarjetas' })
export class Tarjeta extends Model<Tarjeta> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  numeroTarjeta: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  cvc: string;

  @Column({
    type: DataType.ENUM('debito', 'credito'),
    allowNull: false,
  })
  tipo: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  activa: boolean;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  limiteCredito: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pin: string;

  @ForeignKey(() => Cuenta)
  @Column
  cuentaId: number;

  @BelongsTo(() => Cuenta)
  cuenta: Cuenta;
}
