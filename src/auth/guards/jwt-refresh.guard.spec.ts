import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('JwtRefreshGuard', () => {
  let guard: JwtRefreshGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtRefreshGuard],
    }).compile();

    guard = module.get<JwtRefreshGuard>(JwtRefreshGuard);
  });

  it('должен быть создан', () => {
    expect(guard).toBeDefined();
  });

  it('должен быть экземпляром класса AuthGuard со стратегией jwt-refresh', () => {
    expect(guard).toBeInstanceOf(JwtRefreshGuard);
  });

  it('должен вызывать canActivate и делегировать логику AuthGuard', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer valid-refresh-token' },
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

  it('должен пропустить запрос с валидным refresh токеном', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer valid-refresh-token' },
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

  it('должен выбросить ошибку, если refresh токен не передан', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: {},
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

  it('должен выбросить ошибку, если refresh токен не содержит Bearer', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'invalid-refresh-token' },
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

  it('должен выбросить ошибку, если refresh токен невалидный', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer invalid-refresh-token' },
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

  it('должен выбросить ошибку, если refresh токен просрочен', async () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer expired-refresh-token' },
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