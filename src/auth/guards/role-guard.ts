import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface UserPayload {
  id: string;
  role: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const required_roles = this.reflector.get<string[]>(
      'Roles',
      context.getHandler(),
    );
    const request = context.switchToHttp();
    const getRequest = request.getRequest<Request & { user?: UserPayload }>();
    const userData = getRequest.user;

    const required_role = required_roles.includes(userData?.role ?? '');

    if (!required_role)
      throw new UnauthorizedException('Failed to use this method!');

    return true;
  }
}
