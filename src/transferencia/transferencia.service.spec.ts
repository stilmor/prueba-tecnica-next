import { Test, TestingModule } from '@nestjs/testing';
import { TransferenciaService } from './transferencia.service';
import { getModelToken } from '@nestjs/sequelize';
import { Movimiento } from '../models/movimiento.model';
import { BadRequestException } from '@nestjs/common';

describe('TransferenciaService', () => {
  let service: TransferenciaService;
  let movimientoModel: typeof Movimiento;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransferenciaService,
        {
          provide: getModelToken(Movimiento),
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransferenciaService>(TransferenciaService);
    movimientoModel = module.get<typeof Movimiento>(getModelToken(Movimiento));
  });

  it('debería lanzar un error si el IBAN es inválido', async () => {
    await expect(
      service.realizarTransferencia('1', 100, 'IBAN_INVALIDO', true),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería aplicar una comisión cuando es un banco distinto', async () => {
    const movimientoMock = {
      id: 1,
      cuentaId: 1,
      tipo: 'transferencia',
      monto: 105,
      fecha: new Date(),
    } as Movimiento;

    (movimientoModel.create as jest.Mock).mockResolvedValue(movimientoMock);

    const result = await service.realizarTransferencia(
      '1',
      100,
      'ES9121000418450200051332',
      false,
    );

    expect(result.monto).toBe(105);
    expect(movimientoModel.create).toHaveBeenCalledWith({
      cuentaId: 1,
      tipo: 'transferencia',
      monto: 105,
      fecha: expect.any(Date),
    });
  });
});
