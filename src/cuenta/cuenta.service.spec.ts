import { Test, TestingModule } from '@nestjs/testing';
import { CuentaService } from './cuenta.service';
import { getModelToken } from '@nestjs/sequelize';
import { Cuenta } from '../models/cuenta.model';
import { Movimiento } from '../models/movimiento.model';
import { Tarjeta } from '../models/tarjeta.model';
import { BadRequestException } from '@nestjs/common';

describe('CuentaService', () => {
  let service: CuentaService;
  let cuentaModel: typeof Cuenta;
  let movimientoModel: typeof Movimiento;
  let tarjetaModel: typeof Tarjeta;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaService,
        {
          provide: getModelToken(Cuenta),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getModelToken(Movimiento),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(Tarjeta),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CuentaService>(CuentaService);
    cuentaModel = module.get<typeof Cuenta>(getModelToken(Cuenta));
    movimientoModel = module.get<typeof Movimiento>(getModelToken(Movimiento));
    tarjetaModel = module.get<typeof Tarjeta>(getModelToken(Tarjeta));
  });

  it('debería obtener movimientos de una cuenta específica', async () => {
    const cuentaMock = {
      id: 1,
      numeroCuenta: '1234567890',
      movimientos: [{ tipo: 'ingreso', monto: 100 }],
    };
    (cuentaModel.findOne as jest.Mock).mockResolvedValue(cuentaMock);

    const result = await service.obtenerMovimientos('1234567890');

    expect(result).toEqual(cuentaMock.movimientos);
    expect(cuentaModel.findOne).toHaveBeenCalledWith({
      where: { numeroCuenta: '1234567890' },
      include: [Movimiento],
    });
  });

  it('debería lanzar un error si la cuenta no se encuentra al obtener movimientos', async () => {
    (cuentaModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.obtenerMovimientos('1234567890')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería retirar dinero de la cuenta con saldo suficiente y tarjeta válida', async () => {
    const cuentaMock = {
      id: 1,
      numeroCuenta: '1234567890',
      saldo: 1000,
      save: jest.fn(),
    };
    const tarjetaMock = {
      numeroTarjeta: '1111222233334444',
      cuentaId: 1,
      cvc: '123',
      tipo: 'debito',
    };

    (cuentaModel.findOne as jest.Mock).mockResolvedValue(cuentaMock);
    (tarjetaModel.findOne as jest.Mock).mockResolvedValue(tarjetaMock);
    (movimientoModel.create as jest.Mock).mockResolvedValue({
      tipo: 'retiro',
      monto: 100,
    });

    const result = await service.retirarDinero(
      '1234567890',
      100,
      '1111222233334444',
      '123',
    );

    expect(result).toEqual({ tipo: 'retiro', monto: 100 });
    expect(cuentaMock.saldo).toBe(900);
    expect(cuentaMock.save).toHaveBeenCalled();
  });

  it('debería lanzar un error si la tarjeta no es válida al retirar dinero', async () => {
    const cuentaMock = { id: 1, numeroCuenta: '1234567890', saldo: 1000 };

    (cuentaModel.findOne as jest.Mock).mockResolvedValue(cuentaMock);
    (tarjetaModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.retirarDinero('1234567890', 100, '1111222233334444', '123'),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería ingresar dinero solo en cajeros propios', async () => {
    const cuentaMock = {
      id: 1,
      numeroCuenta: '1234567890',
      saldo: 1000,
      save: jest.fn(),
    };

    (cuentaModel.findOne as jest.Mock).mockResolvedValue(cuentaMock);
    (movimientoModel.create as jest.Mock).mockResolvedValue({
      tipo: 'ingreso',
      monto: 100,
    });

    const result = await service.ingresarDinero('1234567890', 100, true);

    expect(result).toEqual({ tipo: 'ingreso', monto: 100 });
    expect(cuentaMock.saldo).toBe(1100);
    expect(cuentaMock.save).toHaveBeenCalled();
  });

  it('debería lanzar un error si el ingreso se intenta en un cajero no propio', async () => {
    await expect(
      service.ingresarDinero('1234567890', 100, false),
    ).rejects.toThrow(BadRequestException);
  });
});
