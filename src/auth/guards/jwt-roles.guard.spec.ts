import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtRolesGuard } from './jwt-roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/users.enums';

const mockSuperCanActivate = jest.fn();

jest.mock('@nestjs/passport', () => ({
  AuthGuard: () => {
    return class MockAuthGuard {
      canActivate(context) {
        return mockSuperCanActivate(context);
      }
    };
  },
}));

describe('JwtRolesGuard', () => {
  let guard: JwtRolesGuard;
  let reflector: Reflector;

  const createMockContext = (userRole?: Role) => {
    const request = {
      user: { role: userRole },
    };
    return {
      getHandler: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtRolesGuard>(JwtRolesGuard);
    reflector = module.get<Reflector>(Reflector);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return false if AuthGuard (super) fails', async () => {
      mockSuperCanActivate.mockResolvedValue(false);

      const context = createMockContext();

      const result = await guard.canActivate(context);

      expect(mockSuperCanActivate).toHaveBeenCalledWith(context);
      expect(result).toBe(false);
    });

    it('should return true if no roles are required (public route)', async () => {
      mockSuperCanActivate.mockResolvedValue(true);
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const context = createMockContext(Role.User);
      const result = await guard.canActivate(context);

      expect(reflector.get).toHaveBeenCalledWith(
        ROLES_KEY,
        context.getHandler(),
      );
      expect(result).toBe(true);
    });

    it('should return true if user has the required role', async () => {
      mockSuperCanActivate.mockResolvedValue(true);
      jest.spyOn(reflector, 'get').mockReturnValue([Role.Admin]);

      const context = createMockContext(Role.Admin);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false if user does not have the required role', async () => {
      mockSuperCanActivate.mockResolvedValue(true);
      jest.spyOn(reflector, 'get').mockReturnValue([Role.Admin]);

      const context = createMockContext(Role.User);
      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
