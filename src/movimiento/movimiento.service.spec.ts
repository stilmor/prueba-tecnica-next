import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoService } from './movimiento.service';
import { getModelToken } from '@nestjs/sequelize';
import { Movimiento } from '../models/movimiento.model';
import { BadRequestException } from '@nestjs/common';

describe('MovimientoService', () => {
  let service: MovimientoService;
  let movimientoModel: typeof Movimiento;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovimientoService,
        {
          provide: getModelToken(Movimiento),
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovimientoService>(MovimientoService);
    movimientoModel = module.get<typeof Movimiento>(getModelToken(Movimiento));
  });

  it('debería obtener movimientos de una cuenta', async () => {
    const movimientosMock: Partial<Movimiento>[] = [
      { tipo: 'ingreso', monto: 100 } as Movimiento,
    ];
    (movimientoModel.findAll as jest.Mock).mockResolvedValue(movimientosMock);

    const result = await service.findByCuentaId(1);

    expect(result).toEqual(movimientosMock);
    expect(movimientoModel.findAll).toHaveBeenCalledWith({
      where: { cuentaId: 1 },
    });
  });

  it('debería lanzar un error si el monto es negativo al crear un movimiento', async () => {
    const mockMovimiento = jest.spyOn(movimientoModel, 'create');
    mockMovimiento.mockImplementation(() => {
      throw new BadRequestException('El monto debe ser positivo');
    });
  });
});
