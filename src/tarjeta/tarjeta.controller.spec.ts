import { Test, TestingModule } from '@nestjs/testing';
import { TarjetaController } from './tarjeta.controller';
import { TarjetaService } from './tarjeta.service';

describe('TarjetaController', () => {
  let controller: TarjetaController;
  let tarjetaService: TarjetaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarjetaController],
      providers: [
        {
          provide: TarjetaService,
          useValue: {
            activarTarjeta: jest.fn(),
            cambiarPin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TarjetaController>(TarjetaController);
    tarjetaService = module.get<TarjetaService>(TarjetaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call activarTarjeta with correct parameters', async () => {
    const numeroTarjeta = '1234567890123456';
    const cvc = '123';
    const pin = '5678';

    jest.spyOn(tarjetaService, 'activarTarjeta').mockResolvedValueOnce({
      numeroTarjeta,
      activa: true,
    } as any);

    const result = await controller.activarTarjeta(numeroTarjeta, cvc, pin);

    expect(tarjetaService.activarTarjeta).toHaveBeenCalledWith(
      numeroTarjeta,
      cvc,
      pin,
    );
    expect(result).toEqual({ numeroTarjeta, activa: true });
  });

  it('should call cambiarPin with correct parameters', async () => {
    const numeroTarjeta = '1234567890123456';
    const pinActual = '1234';
    const nuevoPin = '5678';
    const cvc = '123';

    jest.spyOn(tarjetaService, 'cambiarPin').mockResolvedValueOnce({
      numeroTarjeta,
      pin: nuevoPin,
    } as any);

    const result = await controller.cambiarPin(
      numeroTarjeta,
      pinActual,
      nuevoPin,
      cvc,
    );

    expect(tarjetaService.cambiarPin).toHaveBeenCalledWith(
      numeroTarjeta,
      pinActual,
      nuevoPin,
      cvc,
    );
    expect(result).toEqual({ numeroTarjeta, pin: nuevoPin });
  });
});
