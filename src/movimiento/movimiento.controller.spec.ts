import { Test, TestingModule } from '@nestjs/testing';
import { MovimientoController } from './movimiento.controller';
import { MovimientoService } from './movimiento.service';
import { Movimiento } from '../models/movimiento.model';

describe('MovimientoController', () => {
  let controller: MovimientoController;
  let movimientoService: MovimientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovimientoController],
      providers: [
        {
          provide: MovimientoService,
          useValue: {
            findByCuentaId: jest.fn(),
            createMovimiento: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MovimientoController>(MovimientoController);
    movimientoService = module.get<MovimientoService>(MovimientoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findByCuentaId with correct numeroCuenta', async () => {
    const numeroCuenta = '123456';

    const mockMovimientos = [
      {
        id: 1,
        tipo: 'ingreso',
        monto: 100,
        fecha: new Date(),
        cuentaId: 1,
      },
    ] as Movimiento[];

    jest
      .spyOn(movimientoService, 'findByCuentaId')
      .mockResolvedValue(mockMovimientos);

    const result = await controller.findByCuentaId(numeroCuenta);

    expect(movimientoService.findByCuentaId).toHaveBeenCalledWith(
      +numeroCuenta,
    );
    expect(result).toEqual(mockMovimientos);
  });
});
