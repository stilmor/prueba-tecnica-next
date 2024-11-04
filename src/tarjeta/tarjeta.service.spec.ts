import { Test, TestingModule } from '@nestjs/testing';
import { TarjetaService } from './tarjeta.service';
import { getModelToken } from '@nestjs/sequelize';
import { Tarjeta } from '../models/tarjeta.model';
import * as bcrypt from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';

jest.mock('bcryptjs');

describe('TarjetaService', () => {
  let service: TarjetaService;
  let tarjetaModel: typeof Tarjeta;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TarjetaService,
        {
          provide: getModelToken(Tarjeta),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TarjetaService>(TarjetaService);
    tarjetaModel = module.get<typeof Tarjeta>(getModelToken(Tarjeta));
  });

  it('debería activar la tarjeta correctamente', async () => {
    const tarjetaMock = {
      numeroTarjeta: '1234567890123456',
      cvc: '123',
      activa: false,
      pin: null,
      save: jest.fn().mockResolvedValue({ activa: true, pin: 'hashedPin' }),
    };

    (tarjetaModel.findOne as jest.Mock).mockResolvedValue(tarjetaMock);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPin');

    const result = await service.activarTarjeta(
      '1234567890123456',
      '123',
      '5678',
    );

    expect(tarjetaModel.findOne).toHaveBeenCalledWith({
      where: { numeroTarjeta: '1234567890123456' },
    });
    expect(result.activa).toBe(true);
    expect(result.pin).toBe('hashedPin');
    expect(tarjetaMock.save).toHaveBeenCalled();
  });

  it('debería cambiar el PIN correctamente', async () => {
    const tarjetaMock = {
      numeroTarjeta: '1234567890123456',
      cvc: '123',
      activa: true,
      pin: 'hashedOldPin',
      save: jest.fn().mockResolvedValue({ pin: 'hashedNewPin' }),
    };

    (tarjetaModel.findOne as jest.Mock).mockResolvedValue(tarjetaMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPin');

    const result = await service.cambiarPin(
      '1234567890123456',
      '1234',
      '5678',
      '123',
    );

    expect(tarjetaModel.findOne).toHaveBeenCalledWith({
      where: { numeroTarjeta: '1234567890123456' },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('1234', 'hashedOldPin');
    expect(result.pin).toBe('hashedNewPin');
    expect(tarjetaMock.save).toHaveBeenCalled();
  });

  it('debería lanzar un error si el CVC es incorrecto al activar la tarjeta', async () => {
    const tarjetaMock = {
      numeroTarjeta: '1234567890123456',
      cvc: '123',
      activa: false,
    };

    (tarjetaModel.findOne as jest.Mock).mockResolvedValue(tarjetaMock);

    await expect(
      service.activarTarjeta('1234567890123456', '999', '5678'),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar un error si el PIN actual es incorrecto al cambiar el PIN', async () => {
    const tarjetaMock = {
      numeroTarjeta: '1234567890123456',
      cvc: '123',
      activa: true,
      pin: 'hashedOldPin',
    };

    (tarjetaModel.findOne as jest.Mock).mockResolvedValue(tarjetaMock);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.cambiarPin('1234567890123456', 'incorrectPin', '5678', '123'),
    ).rejects.toThrow(BadRequestException);
  });
});
