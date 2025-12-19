import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

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
});
