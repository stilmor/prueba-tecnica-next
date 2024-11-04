import { Test, TestingModule } from '@nestjs/testing';
import { CuentaController } from './cuenta.controller';
import { CuentaService } from './cuenta.service';

describe('CuentaController', () => {
  let controller: CuentaController;
  let cuentaService: CuentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CuentaController],
      providers: [
        {
          provide: CuentaService,
          useValue: {
            obtenerMovimientos: jest.fn().mockResolvedValue([]),
            retirarDinero: jest.fn().mockResolvedValue({}),
            ingresarDinero: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<CuentaController>(CuentaController);
    cuentaService = module.get<CuentaService>(CuentaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('obtenerMovimientos', () => {
    it('should call cuentaService.obtenerMovimientos with the correct parameters', async () => {
      const numeroCuenta = '1234567890';
      await controller.obtenerMovimientos(numeroCuenta);
      expect(cuentaService.obtenerMovimientos).toHaveBeenCalledWith(
        numeroCuenta,
      );
    });
  });

  describe('retirarDinero', () => {
    it('should call cuentaService.retirarDinero with the correct parameters', async () => {
      const numeroCuenta = '1234567890';
      const data = {
        monto: 100,
        numeroTarjeta: '9876543210123456',
        cvc: '123',
      };
      await controller.retirarDinero(numeroCuenta, data);
      expect(cuentaService.retirarDinero).toHaveBeenCalledWith(
        numeroCuenta,
        data.monto,
        data.numeroTarjeta,
        data.cvc,
      );
    });
  });

  describe('ingresarDinero', () => {
    it('should call cuentaService.ingresarDinero with the correct parameters', async () => {
      const numeroCuenta = '1234567890';
      const data = { monto: 200, esCajeroPropio: true };
      await controller.ingresarDinero(numeroCuenta, data);
      expect(cuentaService.ingresarDinero).toHaveBeenCalledWith(
        numeroCuenta,
        data.monto,
        data.esCajeroPropio,
      );
    });
  });
});
