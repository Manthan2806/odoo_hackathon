import { Role } from '../lib/prisma-client';

export interface AuthUser {
  id: string;
  role: Role;
  employeeId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};