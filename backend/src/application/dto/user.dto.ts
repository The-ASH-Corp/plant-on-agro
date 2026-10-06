import { UserRole } from '../../core/entities/user.entity';

export interface CreateUserInputDto {
  name: string;
  email: string;
  role?: UserRole;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
