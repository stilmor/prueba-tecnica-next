import { Test, TestingModule } from '@nestjs/testing';
import { TransferenciaController } from './transferencia.controller';
import { TransferenciaService } from './transferencia.service';
import { Movimiento } from '../models/movimiento.model';

describe('TransferenciaController', () => {
  let controller: TransferenciaController;
  let transferenciaService: TransferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferenciaController],
      providers: [
        {
          provide: TransferenciaService,
          useValue: {
            realizarTransferencia: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransferenciaController>(TransferenciaController);
    transferenciaService =
      module.get<TransferenciaService>(TransferenciaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call realizarTransferencia with correct parameters', async () => {
    const transferenciaData = {
      monto: 100,
      ibanDestino: 'ES1234567890123456789012',
      esMismoBanco: true,
    };
    const id = '1';
    const mockMovimiento: Partial<Movimiento> = {
      id: 1,
      tipo: 'transferencia',
      monto: transferenciaData.monto,
      fecha: new Date(),
      cuentaId: parseInt(id, 10),
    };

    jest
      .spyOn(transferenciaService, 'realizarTransferencia')
      .mockResolvedValue(mockMovimiento as Movimiento);

    const result = await controller.realizarTransferencia({
      numeroCuentaOrigen: id,
      monto: transferenciaData.monto,
      ibanDestino: transferenciaData.ibanDestino,
      esMismoBanco: transferenciaData.esMismoBanco,
    });

    expect(transferenciaService.realizarTransferencia).toHaveBeenCalledWith(
      +id,
      transferenciaData.monto,
      transferenciaData.ibanDestino,
      transferenciaData.esMismoBanco,
    );
    expect(result).toEqual(mockMovimiento);
  });

  it('should throw an error if realizarTransferencia fails', async () => {
    const transferenciaData = {
      monto: 100,
      ibanDestino: 'ES1234567890123456789012',
      esMismoBanco: false,
    };
    const id = '1';
    jest
      .spyOn(transferenciaService, 'realizarTransferencia')
      .mockRejectedValue(new Error('Error en la transferencia'));

    await expect(
      controller.realizarTransferencia({
        numeroCuentaOrigen: id,
        monto: transferenciaData.monto,
        ibanDestino: transferenciaData.ibanDestino,
        esMismoBanco: transferenciaData.esMismoBanco,
      }),
    ).rejects.toThrow('Error en la transferencia');
  });
});
