export type AllowedRegistrationRole = 'farmer' | 'buyer';

export interface RegisterUserInputDto {
  name: string;
  email: string;
  password: string;
  role?: AllowedRegistrationRole;
}

export interface RegisterUserResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
