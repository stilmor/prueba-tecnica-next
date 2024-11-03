import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Cuenta } from './cuenta.model';

@Table({ tableName: 'clientes' })
export class Cliente extends Model<Cliente> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nombre: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  apellido: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @HasMany(() => Cuenta)
  cuentas: Cuenta[];
}
