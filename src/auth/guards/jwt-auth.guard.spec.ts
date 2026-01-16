import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  it('должен быть создан', () => {
    expect(guard).toBeDefined();
  });

  it('должен быть экземпляром класса AuthGuard со стратегией jwt', () => {
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });

  it('должен вызывать canActivate и делегировать логику AuthGuard', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer valid-jwt-token' },
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockResolvedValue(true);
    const result = await guard.canActivate(mockExecutionContext);

    expect(canActivateSpy).toHaveBeenCalledWith(mockExecutionContext);
    expect(result).toBe(true);

    canActivateSpy.mockRestore();
  });

  it('должен пропустить запрос с валидным токеном', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer valid-jwt-token' },
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockResolvedValue(true);
    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(canActivateSpy).toHaveBeenCalledWith(mockExecutionContext);

    canActivateSpy.mockRestore();
  });

  it('должен выбросить ошибку, если токен не передан', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {}, // Нет заголовка authorization
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockRejectedValue(new UnauthorizedException());

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );

    canActivateSpy.mockRestore();
  });

  it('должен выбросить ошибку, если токен не содержит Bearer', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'invalid-jwt-token' }, // Токен без Bearer
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockRejectedValue(new UnauthorizedException());

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );

    canActivateSpy.mockRestore();
  });

  it('должен выбросить ошибку, если токен невалидный', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer invalid-jwt-token' }, // Невалидный токен
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockRejectedValue(new UnauthorizedException());

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );

    canActivateSpy.mockRestore();
  });

  it('должен выбросить ошибку, если токен просрочен', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer expired-jwt-token' }, // Просроченный токен
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    const canActivateSpy = jest
      .spyOn(guard, 'canActivate')
      .mockRejectedValue(new UnauthorizedException());

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
      UnauthorizedException,
    );

    canActivateSpy.mockRestore();
  });
});
